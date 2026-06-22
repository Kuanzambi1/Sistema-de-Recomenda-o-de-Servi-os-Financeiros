import  Text  from "../ui/text";

interface AuthHeaderProps {
  title: string;
  description: string;
  className?: string
}


export default function AuthHeader({ title, description, className}: AuthHeaderProps) {

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center gap-1">
        <img src="\logo.svg" alt="Logo" className="ml-xs" />
      <Text as="h1" className={`text-center ${className}`}>
        {title}
      </Text>
      <Text as="p" variant="p">
        {description}
      </Text>
    </div>
  );
}