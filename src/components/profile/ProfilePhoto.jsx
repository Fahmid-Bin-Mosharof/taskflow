import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCamera, FiTrash2 } from 'react-icons/fi'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import ConfirmModal from '../common/ConfirmModal'
import Input from '../common/Input'
import Modal from '../common/Modal'
import { ACCEPTED_IMAGE_TYPES, ImageError, fileToAvatarDataUrl } from '../../utils/imageUtils'
import { PHOTO_URL_MAX, validatePhotoUrl } from '../../utils/validators'

export default function ProfilePhoto({ name, photoURL, onSave, onRemove }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')
  const [urlSaving, setUrlSaving] = useState(false)

  const hasPhoto = Boolean(photoURL)
  const busy = processing || saving || removing || urlSaving

  const openPicker = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allows choosing the same file again
    if (!file) return

    setProcessing(true)
    try {
      setPreview(await fileToAvatarDataUrl(file))
    } catch (err) {
      toast.error(err instanceof ImageError ? err.message : 'Could not process that image.')
    } finally {
      setProcessing(false)
    }
  }

  const handleConfirmPreview = async () => {
    setSaving(true)
    try {
      await onSave(preview)
      setPreview(null)
    } catch {
      // The parent already showed an error toast. Keep the preview open to retry.
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await onRemove()
      setConfirmRemove(false)
    } catch {
      // The parent already showed an error toast.
    } finally {
      setRemoving(false)
    }
  }

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    const error = validatePhotoUrl(urlValue)
    setUrlError(error)
    if (error) return

    setUrlSaving(true)
    try {
      await onSave(urlValue.trim())
      setUrlValue('')
    } catch {
      // The parent already showed an error toast.
    } finally {
      setUrlSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Avatar name={name} photoURL={photoURL} size="xl" />

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button size="sm" onClick={openPicker} loading={processing} disabled={busy}>
          {!processing && <FiCamera size={16} aria-hidden="true" />}
          {hasPhoto ? 'Change photo' : 'Upload photo'}
        </Button>
        {hasPhoto && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600! dark:text-red-400!"
            onClick={() => setConfirmRemove(true)}
            disabled={busy}
          >
            <FiTrash2 size={16} aria-hidden="true" />
            Remove photo
          </Button>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        JPG, PNG, or WebP up to 5 MB. Photos are cropped to a square.
      </p>

      <details className="mt-4 w-full">
        <summary className="cursor-pointer text-center text-sm text-primary hover:underline">
          Use an image link instead
        </summary>
        <form onSubmit={handleUrlSubmit} noValidate className="mt-3 space-y-3 text-left">
          <Input
            label="Image URL"
            name="photoURL"
            type="url"
            autoComplete="off"
            placeholder="https://example.com/photo.jpg"
            maxLength={PHOTO_URL_MAX}
            value={urlValue}
            onChange={(e) => {
              setUrlValue(e.target.value)
              if (urlError) setUrlError('')
            }}
            error={urlError}
          />
          <Button type="submit" size="sm" fullWidth loading={urlSaving} disabled={busy && !urlSaving}>
            Use this link
          </Button>
        </form>
      </details>

      <Modal
        open={preview !== null}
        onClose={saving ? () => {} : () => setPreview(null)}
        title="Preview your photo"
        size="sm"
      >
        <div className="flex flex-col items-center">
          <img
            src={preview ?? ''}
            alt="Preview of your new profile picture"
            className="h-40 w-40 rounded-full border border-slate-200 object-cover dark:border-slate-700"
          />
          <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">
            This is how your picture will look.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={openPicker} disabled={saving}>
            Choose different
          </Button>
          <Button variant="secondary" onClick={() => setPreview(null)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleConfirmPreview} loading={saving}>
            Save photo
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={handleRemove}
        loading={removing}
        title="Remove profile photo?"
        confirmLabel="Remove"
      >
        <p>Your photo will be removed and replaced with your initials.</p>
      </ConfirmModal>
    </div>
  )
}