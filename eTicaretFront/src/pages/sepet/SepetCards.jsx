import { useContext } from 'react'
import './sepetCards.css'
import { GlobalContext } from '../../apiEndPoint/GlobalProvider'

const SepetCards = ({ urun }) => {

    const { image, name, fiyat, amount, id,sepetUrunId } = urun
    
    const {incrementAdet,decrementAdet,removeUrun} = useContext(GlobalContext)

    return (
        <div className='sepetCardContainer'>

            <figure>
                <img src={image} alt="" />
            </figure>

            <div className='sepetCartDetail'>
                <p> {name} </p>
                <p> {fiyat} TL </p>
                <div className='adet'>
                    <button onClick={()=>incrementAdet(sepetUrunId,urun,amount)} >+</button>
                    <p>{amount} </p>
                    <button onClick={()=>decrementAdet(sepetUrunId,urun,amount)} >-</button>
                </div>

            </div>

            <div className='sepetCardBtn'>
                <button onClick={()=>removeUrun(id,sepetUrunId)} >Ürünü Sil</button>
            </div>

        </div>
    )
}

export default SepetCards