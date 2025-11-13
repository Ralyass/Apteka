import React, { useState } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminUsers from './AdminUsers';
import { Link } from 'react-router-dom';

function _Sidebar() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} style={{ margin: '10px' }}>
                ☰ Menu
            </Button>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ul className="list-unstyled">
                        <li><Link to="/users" className="nav-link">Użytkownicy</Link></li>
                        <li><a href="/medicines" className="nav-link">Leki</a></li>
                        <li><a href="/reports" className="nav-link">Raporty</a></li>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

                    export default _Sidebar