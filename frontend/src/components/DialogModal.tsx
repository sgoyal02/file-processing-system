import '../styles/projects.css';
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  modalAction?:boolean,
  secTxt?:string | null,
  primTxt?:string | null
  children: React.ReactNode;
}

const DialogModal = ({ isOpen, title, onClose, modalAction, secTxt="Cancel", primTxt="Yes", children }: ModalProps) => {

  if (!isOpen) return null;

  return (
    <div className={`flex-center modal-wrapper ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex-between modal-head">
          <h2 className="modal-title">{title}</h2>
          <button className="flex-center modal-close" onClick={onClose}>
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

        </button>
        </div>
        <div className="modal-body">{children}</div>
        {modalAction ?
        <div className='flex-between'>
        <button className='btn-secondary'>{secTxt}</button>
        <button className='btn-primary'>{primTxt}</button>
        </div>
        :null
        }
      </div>
    </div>
  );
}

export default DialogModal;