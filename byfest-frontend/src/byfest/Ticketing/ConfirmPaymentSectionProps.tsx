import "./Ticketing.css";

interface ConfirmPaymentSectionProps {
  onConfirm?: () => void;
  disabled?: boolean;
}

export default function ConfirmPaymentSection({
  onConfirm,
  disabled = false,
}: ConfirmPaymentSectionProps) {
  return (
    <div className="byfest-confirm-section">
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className={`byfest-confirm-btn ${disabled ? "is-disabled" : ""}`}
      >
        Confirm Payment
      </button>
    </div>
  );
}