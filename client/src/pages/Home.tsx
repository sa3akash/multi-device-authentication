import { useEffect, useState } from "react";
import { apiCall } from "../config/http";

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [sessionKey, setSessionKey] = useState<string | null>("");

  useEffect(() => {
    apiCall
      .getSessions()
      .then(({ data }) => {
        console.log(data);
        setData(data.sessions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setSessionKey(localStorage.getItem("sessionKey"));
  }, []);

  const handleLogout = (token: string) => {
    apiCall.logout(token);
    setData((prev) => prev.filter((item) => item.token !== token));
  };

  return (
    <div className="bg-black/80 h-screen text-white flex items-center justify-center">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 relative">
            Settings
            <button
              className="absolute top-4 right-10"
              onClick={() => {
                apiCall.logoutAll();
                setData((prev) =>
                  prev.filter((item) => item.token === sessionKey)
                );
              }}
            >
              Logout all
            </button>
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              Browse a list of Flowbite products designed to help you work and
              play, stay organized, get answers, keep in touch, grow your
              business, and more.
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                IP
              </th>
              <th scope="col" className="px-6 py-3">
                Device name
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Brand
              </th>
              <th scope="col" className="px-6 py-3">
                Model
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((item, index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={index}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.ip}</td>
                  <td className="px-6 py-4">
                    {item.device_info.os.name} {item.device_info.os.version}{" "}
                    {item.device_info.os.platform} -{" "}
                    {item.device_info.client.name}
                  </td>
                  <td className="px-6 py-4">{item.time}</td>
                  <td className="px-6 py-4 capitalize">
                    {item.device_info.device.type}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {item.device_info.device.brand || "-"}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {item.device_info.device.model || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {sessionKey !== item.token ? (
                      <button onClick={() => handleLogout(item.token)}>
                        Logout
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
