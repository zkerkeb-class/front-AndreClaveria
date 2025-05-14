export const getRoutePrefix = (userRole?: string): string => {
  if (!userRole) return "user";

  switch (userRole) {
    case "admin":
      return "admin";
    case "manager":
      return "manager";
    case "user":
      return "user";
    default:
      return "user";
  }
};
