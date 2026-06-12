interface Props {
  children: string;
  id?: string;
}

export default function FieldHelp({ children, id }: Props) {
  return (
    <p id={id} className="text-xs text-slate-500">
      {children}
    </p>
  );
}
