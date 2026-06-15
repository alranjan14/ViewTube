const getInitials = (name = "User") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const UserAvatar = ({ name = "User", className = "" }) => {
  return (
    <div
      className={
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 " +
        className
      }
      aria-label={`${name} avatar`}
      role="img"
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
