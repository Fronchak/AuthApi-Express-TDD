import checkRoles from "./checkRoles";

const checkWorkerOrAdmin = () => {
  return checkRoles('worker', 'admin');
}

export default checkWorkerOrAdmin;
