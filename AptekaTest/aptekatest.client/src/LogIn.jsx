import './LogIn.css';
function LogIn() {

    return (
        <div className="LogInPanel">
            <div className="header">
                <div className="text">Zaloguj siê</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input type="text" placeholder="Username" />
                </div>
                <div className="input">
                    <input type="password" placeholder="Password" />
                </div>
            </div>
            <div className="button">
                <button>Log In</button>
            </div>
        </div>
    );
}

export default LogIn;