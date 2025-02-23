import React, { useContext, useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { GlobalContext } from '../../apiEndPoint/GlobalProvider';

const UrunGuncelleModal = ({ urun, show, handleClose,handleGüncelle }) => {


    const { kategoriler, bedenler, urunRenkleri,    } = useContext(GlobalContext)

    const [seciliUrun,setSeciliUrun] = useState({})

    useEffect(()=> {
       setSeciliUrun(urun)
    },[])


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>

                    <label> ürün adı </label>
                    <input type="text" defaultValue={seciliUrun.name} onChange={(e) => setSeciliUrun({ ...seciliUrun, name: e.target.value })} /> <br />

                    <label> ürün acıklama </label>
                    <input type="text" defaultValue={seciliUrun.aciklama} onChange={(e) => setSeciliUrun({ ...seciliUrun, aciklama: e.target.value })} /> <br />

                    <label> ürün fiyat </label>
                    <input type="text" defaultValue={seciliUrun.fiyat} onChange={(e) => setSeciliUrun({ ...seciliUrun, fiyat: e.target.value })} /> <br />

                    <label> ürün stok </label>
                    <input type="text" defaultValue={seciliUrun.stok} onChange={(e) => setSeciliUrun({ ...seciliUrun, stok: e.target.value })} /> <br />

                    <label> ürün resim </label>
                    <input type="file" accept='image/*' onChange={(e) => setSeciliUrun({ ...seciliUrun, image: e.target.files[0] })} /> <br />

                    <label> ürün kategori </label>
                    <select  onChange={(e) => setSeciliUrun({ ...seciliUrun, category: e.target.value })} >
                        <option value=""> Kategori Seç </option>

                        {
                            kategoriler.map((kategori) => (
                                <option key={kategori.id} value={kategori.id} > {kategori.name} </option>
                            ))
                        }
                    </select>
                    <br />

                    <label> ürün ebat </label>
                    <select multiple  onChange={(e) => setSeciliUrun({ ...seciliUrun, ebat: [...e.target.selectedOptions].map((id) => id.value) })}>
                        {
                            bedenler.map((beden) => (
                                <option key={beden.id} value={beden.id}> {beden.name} </option>
                            ))
                        }
                    </select>
                    <br />

                    <label> ürün renk </label>
                    <select multiple  onChange={(e) => setSeciliUrun({ ...seciliUrun, renk: [...e.target.selectedOptions].map((id) => id.value) })} >
                        {
                            urunRenkleri.map((renk) => (
                                <option key={renk.id} value={renk.id} > {renk.name} </option>
                            ))
                        }
                    </select>
                    <br />

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>handleGüncelle(seciliUrun)} >
                    Güncelle
                </Button>
            </Modal.Footer>



        </Modal>
    )
}

export default UrunGuncelleModal