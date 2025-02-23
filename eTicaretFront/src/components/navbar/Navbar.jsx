import React, { useContext, useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import "./navbar.css"
import { FaSearch } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { GlobalContext } from '../../apiEndPoint/GlobalProvider';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Navbar = () => {

    const { validUser, logout, onlineUser, kategoriler, magzaBilgileri,setMagzaBilgileri, magazaOlustur} = useContext(GlobalContext)


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (
        <>
            <nav className='navbarContainer'>
                <Link to={"/"}><h1>Pncr Yazılım</h1></Link>
                <div className='searchContainer'>
                    <input type="text" placeholder='Ara...' />
                    <button> <FaSearch /> </button>
                </div>
                <div className='navbarBtnContainer'>

                    {
                        validUser ? <Link onClick={logout} > {onlineUser.username} Çıkış Yap</Link> :
                            <Link to={"/login"}>Giriş Yap</Link>
                    }

                    <Link to={"/sepet"}>
                        <span> <MdOutlineShoppingCart /> </span>
                        <span>Sepet</span>
                    </Link>
                    <Link to={"/favoriler"}>
                        <span> <FaHeart /> </span>
                        <span>Favorilerim</span>
                    </Link>

                    {onlineUser.is_magza &&
                        <>
                            <Link to={"/magazaUser"}>Magazalarım</Link>
                            <Button variant="primary" onClick={handleShow}>
                                Magaza Ekle
                            </Button>
                        </>
                    }
                </div>

                <div>
                    {
                        kategoriler.map((kategori) => (
                            <Link to={`kategori/${kategori.slug}`} key={kategori.id}> {kategori.name} </Link>
                        ))
                    }
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Magaza Ekleme</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <label>magaza adi</label>
                        <input type="text" onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mAdi:e.target.value})} /><br />
                        <label>magaza telefon</label>
                        <input type="text"  onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mTelefon:e.target.value})} /><br />
                        <label>magaza il</label>
                        <input type="text"  onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mAdresIl:e.target.value})} /><br />
                        <label>magaza ilçe</label>
                        <input type="text" onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mAdresIlce:e.target.value})} /><br />
                        <label>magaza adres</label>
                        <input type="text" onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mAdres:e.target.value})} /><br />
                        <label>magaza email</label>
                        <input type="text" onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mEmail:e.target.value})}/><br />
                        <label>magaza webadresi</label>
                        <input type="text" onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mWebAdres:e.target.value})} /><br />
                        <label>magaza vergi no</label>
                        <input type="text" onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mVn:e.target.value})}/><br />
                        <label>magaza vergi Dairesi</label>
                        <input type="text"  onChange={(e)=>setMagzaBilgileri({...magzaBilgileri,mVd:e.target.value})} />


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={magazaOlustur}>
                            Oluştur
                        </Button>
                    </Modal.Footer>
                </Modal>

            </nav>
            <Outlet />
        </>

    )
}

export default Navbar