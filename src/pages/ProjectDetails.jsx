import { useCallback, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheckSquare,
  FiEdit2,
  FiFolder,
  FiMove,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import OptionsMenu from "../components/common/OptionsMenu";
import TaskBoard from "../components/tasks/TaskBoard";
import TaskDetails from "../components/tasks/TaskDetails";
import TaskModal from "../components/tasks/TaskModal";
import TaskToolbar from "../components/tasks/TaskToolbar";
import { useProject } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { getFirestoreErrorMessage } from "../firebase/errors";
import { formatDate } from "../utils/dateUtils";
import { getProgress } from "../utils/projectUtils";
import { ALL, STATUSES, UNASSIGNED, countByStatus } from "../utils/taskUtils";

const NO_MODAL = { type: null, taskId: null, status: "todo" }; // type: 'create' | 'edit' | 'details' | 'delete'

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { project, loading, notFound, error, retry } = useProject(projectId);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    retry: retryTasks,
    addTask,
    editTask,
    removeTask,
    moveTask,
  } = useTasks(projectId);
  const { users, loading: usersLoading } = useUsers();
  const { filters, setFilter, clearFilters, hasActiveFilters, visibleTasks } =
    useTaskFilters(tasks);
  const [modal, setModal] = useState(NO_MODAL);
  const [deleting, setDeleting] = useState(false);

  const usersById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users],
  );

  const getAssignee = useCallback(
    (assignedTo) => {
      if (!assignedTo) return null;
      return (
        usersById.get(assignedTo) ?? {
          name: usersLoading ? "Loading..." : "Unknown user",
          photoURL: "",
        }
      );
    },
    [usersById, usersLoading],
  );

  // Filter choices: people assigned in this project (plus the active one, if any).
  const assigneeOptions = useMemo(() => {
    const ids = new Set(tasks.map((task) => task.assignedTo).filter(Boolean));
    if (filters.assignee !== ALL && filters.assignee !== UNASSIGNED) {
      ids.add(filters.assignee);
    }
    const people = [...ids]
      .map((id) => ({ value: id, label: getAssignee(id).name }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [
      { value: ALL, label: "All" },
      { value: UNASSIGNED, label: "Unassigned" },
      ...people,
    ];
  }, [tasks, filters.assignee, getAssignee]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === modal.taskId) ?? null,
    [tasks, modal.taskId],
  );

  const openModal = useCallback(
    (type, task = null, status = "todo") =>
      setModal({ type, taskId: task?.id ?? null, status }),
    [],
  );
  const closeModal = useCallback(() => setModal(NO_MODAL), []);

  // Used by drag and drop and by the "Move to" menu items.
  const handleMoveTask = useCallback(
    async (task, status) => {
      try {
        await moveTask(task.id, status);
        // A fixed id replaces the previous toast instead of stacking several.
        toast.success("Task moved successfully", { id: "task-moved" });
      } catch (err) {
        toast.error(getFirestoreErrorMessage(err));
      }
    },
    [moveTask],
  );

  const renderMenu = useCallback(
    (task) => (
      <OptionsMenu
        label={`Options for ${task.title}`}
        items={[
          {
            label: "Edit",
            icon: FiEdit2,
            onClick: () => openModal("edit", task),
          },
          ...STATUSES.filter((status) => status.value !== task.status).map(
            (status) => ({
              label: `Move to ${status.label}`,
              icon: FiMove,
              onClick: () => handleMoveTask(task, status.value),
            }),
          ),
          {
            label: "Delete",
            icon: FiTrash2,
            danger: true,
            onClick: () => openModal("delete", task),
          },
        ]}
      />
    ),
    [openModal, handleMoveTask],
  );

  // Throws on failure so the form can re-enable its submit button.
  const handleSave = async (values) => {
    try {
      if (modal.type === "edit") {
        await editTask(modal.taskId, values);
        toast.success("Task updated successfully");
      } else {
        await addTask(values);
        toast.success("Task created successfully");
      }
      closeModal();
    } catch (err) {
      toast.error(getFirestoreErrorMessage(err));
      throw err;
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeTask(modal.taskId);
      toast.success("Task deleted successfully");
      closeModal();
    } catch (err) {
      toast.error(getFirestoreErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading project..." />;

  if (notFound) {
    return (
      <EmptyState
        icon={FiFolder}
        title="Project not found"
        description="This project doesn't exist, or you don't have access to it."
        action={
          <Button to="/dashboard/projects" variant="secondary">
            Back to Projects
          </Button>
        }
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={FiAlertCircle}
        title="Couldn't load this project"
        description={error}
        action={<Button onClick={retry}>Try again</Button>}
      />
    );
  }

  const completed = countByStatus(tasks, "done");
  const progress = getProgress(tasks.length, completed);

  const renderBoard = () => {
    if (tasksLoading) return <LoadingSpinner label="Loading tasks..." />;

    if (tasksError) {
      return (
        <EmptyState
          icon={FiAlertCircle}
          title="Couldn't load tasks"
          description={tasksError}
          action={<Button onClick={retryTasks}>Try again</Button>}
        />
      );
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          icon={FiCheckSquare}
          title="No tasks found."
          description="Create a task to start managing your project."
          action={
            <Button onClick={() => openModal("create")}>
              <FiPlus size={18} aria-hidden="true" />
              Add Task
            </Button>
          }
        />
      );
    }

    return (
      <>
        <TaskToolbar
          filters={filters}
          onFilterChange={setFilter}
          assigneeOptions={assigneeOptions}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          shown={visibleTasks.length}
          total={tasks.length}
        />

        {visibleTasks.length === 0 ? (
          <EmptyState
            icon={FiSearch}
            title="No matching tasks"
            description="Try a different search term or clear your filters."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <TaskBoard
            tasks={visibleTasks}
            getAssignee={getAssignee}
            onAddTask={(status) => openModal("create", null, status)}
            renderMenu={renderMenu}
            onOpenTask={(task) => openModal("details", task)}
            onMoveTask={handleMoveTask}
          />
        )}
      </>
    );
  };

  return (
    <div>
      <Link
        to="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-primary dark:text-slate-400"
      >
        <FiArrowLeft size={16} aria-hidden="true" />
        Projects
      </Link>

      <header className="mb-8 mt-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-1.5 max-w-3xl wrap-break-word text-slate-600 dark:text-slate-400">
                {project.description}
              </p>
            )}
          </div>
          <Button onClick={() => openModal("create")}>
            <FiPlus size={18} aria-hidden="true" />
            Add Task
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <FiCalendar size={15} aria-hidden="true" />
            Created {formatDate(project.createdAt)}
          </span>
          {!tasksLoading && !tasksError && (
            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} ·{" "}
              {completed} done
            </span>
          )}
        </div>

        {!tasksLoading && !tasksError && tasks.length > 0 && (
          <div className="mt-3 flex max-w-sm items-center gap-3">
            <div
              role="progressbar"
              aria-label="Project progress"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {progress}%
            </span>
          </div>
        )}
      </header>

      {renderBoard()}

      <TaskModal
        open={
          modal.type === "create" ||
          (modal.type === "edit" && Boolean(selectedTask))
        }
        task={modal.type === "edit" ? selectedTask : null}
        defaultStatus={modal.status}
        users={users}
        onClose={closeModal}
        onSubmit={handleSave}
      />

      <TaskDetails
        task={modal.type === "details" ? selectedTask : null}
        getAssignee={getAssignee}
        onClose={closeModal}
        onEdit={(task) => openModal("edit", task)}
        onDelete={(task) => openModal("delete", task)}
      />

      <ConfirmModal
        open={modal.type === "delete" && Boolean(selectedTask)}
        onClose={closeModal}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this task?"
      >
        <p>
          {selectedTask ? (
            <strong className="wrap-break-word">{selectedTask.title}</strong>
          ) : (
            "This task"
          )}{" "}
          will be permanently deleted. This action cannot be undone.
        </p>
      </ConfirmModal>
    </div>
  );
}
