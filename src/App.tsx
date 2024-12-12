import { useState, useEffect } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [workspaceInfo, setWorkspaceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Check if access token exists in localStorage
  useEffect(() => {
    const accessToken = localStorage.getItem("clickup_token");

    console.log("useEffect: accessToken", accessToken);
    if (accessToken) {
      fetchWorkspaceInfo();
    }
  }, []);

  const handleConnect = () => {
    const extensionId = chrome.runtime.id;
    const backendAuthUrl = `http://localhost:3000/auth?extensionId=${extensionId}`;

    setLoading(true); // Show loading spinner

    chrome.identity.launchWebAuthFlow(
      { url: backendAuthUrl, interactive: true },
      (redirectResponse) => {
        if (!redirectResponse) {
          console.error("Authorization failed or was canceled.");
          setLoading(false); // Hide loading spinner
          return;
        }

        console.log(redirectResponse, "redirectResponse");
        // Extract the `access_token` from the redirect response
        const urlParams = new URLSearchParams(new URL(redirectResponse).search);
        console.log(urlParams, "urlParams");
        const accessToken = urlParams.get("access_token");

        if (accessToken) {
          localStorage.setItem("clickup_token", accessToken);
          setIsConnected(true);
          console.log("Access token stored successfully:", accessToken);
          fetchWorkspaceInfo(); // Fetch workspace data after successful connection
        } else {
          console.error("Access token not found in response.");
        }

        setLoading(false); // Hide loading spinner after processing
      }
    );
  };

  // Fetch workspace information from backend
  const fetchWorkspaceInfo = async () => {
    const extensionId = chrome.runtime.id;

    const response = await fetch(
      `http://localhost:3000/workspace?extensionId=${extensionId}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching workspace data:", data.error);
    } else {
      setWorkspaceInfo(data);
      setIsConnected(true);
    }
  };

  const getAvatar = (avatar: string | null) => {
    return (
      <img
        src={
          avatar
            ? avatar
            : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        }
        alt="Workspace Avatar"
        className="w-16 h-16 rounded-full object-cover"
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-6 w-60">
      <header className="w-full bg-blue-600 text-white text-center py-4">
        <h1 className="text-3xl font-bold">ItsWare</h1>
      </header>

      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg mt-6">
        {!isConnected ? (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleConnect}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700"
            >
              Connect to ClickUp
            </button>
            {loading && (
              <div className="text-blue-600 text-xl">Connecting...</div>
            )}
            {loading && (
              <div className="mt-4">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: workspaceInfo?.color }}
            >
              <h3 className="text-lg font-bold text-white">
                {workspaceInfo?.name}
              </h3>
              <div className="flex items-center mt-4">
                {getAvatar(workspaceInfo?.avatar)}
                <div className="ml-4">
                  <p className="text-white">Workspace ID: {workspaceInfo?.id}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
