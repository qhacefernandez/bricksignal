interface Props {
  message?: string;
}

export default function InputError({ message }: Props) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600" role="alert">{message}</p>;
}
