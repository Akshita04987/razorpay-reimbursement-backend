function FormInput({ label, as = 'input', className = '', ...props }) {
  const Field = as;

  return (
    <label className="grid gap-1 text-sm font-medium text-gray-700">
      {label}
      <Field
        className={`rounded border border-gray-300 px-3 py-2 font-normal focus:border-blue-600 ${className}`}
        {...props}
      />
    </label>
  );
}

export default FormInput;
