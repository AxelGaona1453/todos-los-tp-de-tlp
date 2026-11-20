import { useEffect, useState } from 'react';
import { usersApi } from '../api/users.api';
import { useAuth } from '../context/AuthContext';
import { ROLE_NAMES, type RoleName, type User } from '../types';

export function AdminUsersPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    usersApi
      .list()
      .then(setUsers)
      .catch((err: Error) => setError(err.message));
  }, []);

  const changeRole = async (id: string, role: RoleName) => {
    setError('');
    setInfo('');
    try {
      const updated = await usersApi.assignRole(id, role);
      setUsers((list) => list.map((u) => (u.id === id ? updated : u)));
      setInfo(`Rol de ${updated.email} actualizado a "${updated.role}"`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const canAssign = hasPermission('user:assign-role');

  return (
    <section>
      <h1>Usuarios</h1>
      {error && <p className="alert error">{error}</p>}
      {info && <p className="alert success">{info}</p>}

      <table className="card table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {canAssign && user.id !== currentUser?.id ? (
                  <select value={user.role} onChange={(e) => changeRole(user.id, e.target.value as RoleName)}>
                    {ROLE_NAMES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="role">{user.role}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
