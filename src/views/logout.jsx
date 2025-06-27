import { useAuth } from '../../AuthContext';

export default function logout(){
    const { logout } = useAuth();
    
    return (<div>
        <button onClick={logout}>Logout</button>
    </div>)
}