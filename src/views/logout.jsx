import { useAuth } from '../../AuthContext';

export default function logout() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { logout } = useAuth();

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
