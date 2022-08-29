export const InputField = ({
  type = 'text',
  value,
  onChange,
  children 
}) => (
  <div className="form-group">
    <label>{children}</label>
    <input
      type={type}
      value={value}
      onChange={event => onChange(event.target.value)}
      className="form-control"
    />
  </div>
);
