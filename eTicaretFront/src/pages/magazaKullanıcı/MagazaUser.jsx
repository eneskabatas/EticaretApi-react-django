import React, { useContext, useEffect, useState } from 'react'
import Section from '../../components/section/Section'
import Footer from '../../components/footer/Footer'
import Table from 'react-bootstrap/Table';
import { GlobalContext } from '../../apiEndPoint/GlobalProvider';
import { Link, Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { magazaGuncelle, magzaGetir } from '../../apiEndPoint/api';

const MagazaUser = () => {

  const { onlineUser, magazalar, magzaBilgileri, setMagzaBilgileri, magazaGuncelleme, magzaDispach,magazaSil } = useContext(GlobalContext)

  if (Object.keys(onlineUser).length == 0 || onlineUser.is_magza == false) {
    return <Navigate to="/" />
  }


  // console.log(magazalar)

  const [show, setShow] = useState(false);

  const [secilenMagaza, setSecilenMagaza] = useState({})

  const handleClose = () => setShow(false);
  const handleShow = (magza) => {
    setSecilenMagaza(magza)
    setMagzaBilgileri(secilenMagaza)
    setShow(true)
  };

  const guncelle = (e) => {
    setMagzaBilgileri({ ...magzaBilgileri, [e.target.name]: e.target.value })
  }

  const handleGuncelle = () => {
    magazaGuncelleme(magzaBilgileri, magzaBilgileri.id)
  }

  useEffect(()=>{
    magzaGetir().then((response)=>{
      magzaDispach({type:"MAGAZA_GETIR", magaza:response})
    })
  },[])

  

  useEffect(() => {
    if (secilenMagaza) {
      setMagzaBilgileri(secilenMagaza)
    }

  }, [secilenMagaza])





  return (
    <>
      <Section>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Magaza Adı</th>
              <th>Email</th>
              <th>Eylemler</th>
            </tr>
          </thead>
          <tbody>

            {
              magazalar.map((magza) => (
                <tr key={magza.id} >
                  <td> {magza.id} </td>
                  <td> {magza.mAdi} </td>
                  <td> {magza.mEmail} </td>
                  <td>
                    <Button variant="primary" onClick={() => handleShow(magza)}>
                      Magaza Güncelle
                    </Button>
                    <Link to={`/magazaDetay/${magza.id}`}>
                    <Button variant="primary" className='mx-3'>
                      Detaya git
                    </Button>
                    </Link>
                    <Button variant="danger" onClick={() => magazaSil(magza.id)}>
                      Magazayı sil
                    </Button>
                  </td>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Magaza Güncelleme</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                      <label>magaza adi</label>
                      <input type="text" name='mAdi' placeholder={secilenMagaza.mAdi} onChange={guncelle} /><br />
                      <label>magaza telefon</label>
                      <input type="text" name='mTelefon' defaultValue={secilenMagaza.mTelefon} onChange={guncelle} /><br />
                      <label>magaza il</label>
                      <input type="text" name='mAdresIl' placeholder={secilenMagaza.mAdresIl} onChange={guncelle} /><br />
                      <label>magaza ilçe</label>
                      <input type="text" name='mAdresIlce' placeholder={secilenMagaza.mAdresIlce} onChange={guncelle} /><br />
                      <label>magaza adres</label>
                      <input type="text" name='mAdres' defaultValue={secilenMagaza.mAdres} onChange={guncelle} /><br />
                      <label>magaza email</label>
                      <input type="text" name='mEmail' defaultValue={secilenMagaza.mEmail} onChange={guncelle} /><br />
                      <label>magaza webadresi</label>
                      <input type="text" name='mWebAdres' onChange={guncelle} /><br />
                      <label>magaza vergi no</label>
                      <input type="text" name='mVn' onChange={guncelle} /><br />
                      <label>magaza vergi Dairesi</label>
                      <input type="text" name='mVd' onChange={guncelle} />


                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleGuncelle} >
                        Güncelle
                      </Button>
                    </Modal.Footer>
                  </Modal>

                </tr>
              ))
            }

          </tbody>
        </Table>
      </Section>
      <Footer />
    </>
  )
}

export default MagazaUser