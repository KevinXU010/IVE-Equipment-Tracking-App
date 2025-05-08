import { useAuth } from '@hooks/auth.jsx'
import { Icon } from '@iconify-icon/react'

function Header() {
  const { user, setToken, setUser } = useAuth()
  return (
    <header className="text-white text-center py-4 text-2xl font-bold shadow-md flex justify-between items-center px-8">
      {user ? (
        <>
          <div className="flex flex-row items-center justify-center bg-white rounded-xl p-4">
            <img
              src="/UniSA-New-Landscape-blue.png"
              alt="UniSA Logo"
              className="mx-auto h-12"
            />
            <div className="text-blue-800">IVE: Equipment Tracking App</div>
          </div>
          <div className="flex items-center gap-4">
            {user.admin && (
              <>
                <span className="bg-white text-blue-800 text-sm p-2 rounded-lg">
                  Admin
                </span>
              </>
            )}

            {/* Display user avatar or default profile Icon */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <Icon
                width={40}
                height={40}
                icon="noto:beaming-face-with-smiling-eyes"
                className="rounded-full"
              />
            )}
            <span className="text-white text-lg">{user.name}</span>
            {/* Logout button */}
            <button
              onClick={() => {
                setToken(null)
                setUser(null)
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="w-full">
          <img
            src="/UniSA-New-Landscape-blue.png"
            alt="UniSA Logo"
            className="mx-auto h-12"
          />
          <div className="text-white">IVE: Equipment Tracking App</div>
        </div>
      )}
    </header>
  )
}

export default Header
