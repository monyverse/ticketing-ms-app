export const Button = ({
  onClick,
  type = 'button',
  children,
}) => (
  <button
    type={type}
    onClick={onClick}
    className="btn btn-primary"
  >
    {children}
  </button>
);
