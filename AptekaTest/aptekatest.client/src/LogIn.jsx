import './LogIn.css';
function LogIn() {

    return (
        <div className="LogInPanel">
            <div className="header">
                <div className="text">Zaloguj się</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input type="text" placeholder="Nazwa użytkownika" />
                </div>
                <div className="input">
                    <input type="password" placeholder="Hasło" />
                </div>
            </div>
            <div className="button">
                <button>Zaloguj się</button>
            </div>
        </div>
    );
}

export default LogIn;