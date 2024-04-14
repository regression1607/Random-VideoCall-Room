import Link from 'next/link';
import { useState,useEffect } from 'react';
import { GrSecure ,GrInsecure} from "react-icons/gr";


function Header() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [api, setApi] = useState('');
    const [key, setKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);


    useEffect(() => {
        const savedApi = sessionStorage.getItem('api');
        const savedKey = sessionStorage.getItem('key');

        if (savedApi) {
            setApi(savedApi);
        }

        if (savedKey) {
            setKey(savedKey);
        }
    }, []);

    const handleSave = () => {
        sessionStorage.setItem('api', api);
        sessionStorage.setItem('key', key);
        setIsSaved(true);
      };
    return (
        <header className="bg-gray-900 dark:bg-gray-900 p-4 flex flex-col sm:flex-row justify-between items-center shadow-lg">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <img
                    alt="Logo"
                    className="rounded-full border-2 border-white"
                    height={40}
                    src="/ekansh.png"
                    style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                    }}
                    width={40}
                />
                <h1 className="text-white dark:text-white text-xl sm:text-2xl font-bold">Random VideoCall Room</h1>
            </div>
            <nav className="flex justify-between items-center space-x-4 sm:space-x-8 mr-4 sm:mr-8">
                <Link className="text-white dark:text-white hover:text-gray-300 transition-colors duration-200" href="/">
                    Home
                </Link>
                <Link className="text-white dark:text-white hover:text-gray-300 transition-colors duration-200" href="https://www.linkedin.com/in/ekanshrajput/">
                    Connect Me
                </Link>
                <Link className="text-white dark:text-white hover:text-gray-300 transition-colors duration-200" href="https://ekanshrajput.netlify.com/">
                    Portfolio
                </Link>
                <div className="relative">
                <span onClick={() => setIsFormVisible(!isFormVisible)}>
  {isSaved ? <GrInsecure color="white" /> : <GrSecure color="white" />}
</span>

                    {isFormVisible && (
                        <form className="absolute right-0 mt-2 p-4 bg-black rounded shadow">
                            <label className="text-white">
                                API Input:
                                <input className='text-black' type="text" name="api" value={api} onChange={e => setApi(e.target.value)} />
                            </label>
                            <label className="text-white">
                                Key Input:
                                <input className='text-black' type="text" name="key" value={key} onChange={e => setKey(e.target.value)} />
                            </label>
                            <br />
                            <button className="bg-blue-500 text-white" type="submit" onClick={handleSave}>Save</button></form>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;