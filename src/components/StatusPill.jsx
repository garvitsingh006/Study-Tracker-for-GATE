import { STATUS_LABEL } from '../utils/progress'

export default function StatusPill({ status, onClick }) {
  return (
    <button
      type="button"
      className={`status-pill ${status}`}
      onClick={onClick}
      title="Click to advance status"
    >
      {STATUS_LABEL[status]}
    </button>
  )
}
