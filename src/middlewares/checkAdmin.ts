import checkRoles from "./checkRoles";

const checkAdmin = () => {
  return checkRoles('admin');
}

export default checkAdmin;
