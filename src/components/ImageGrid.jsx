import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openImageWindow, setImages, setImageIndex } from "../features/modals/imageWindow/imageWindowSlice";

const ImageGrid = ({ images }) => {
    const dispatch = useDispatch();
    var gridType;

    switch(JSON.parse(images).length) {
        case 1:
            gridType = "One";
            break;
        case 2:
            gridType = "Two";
            break;
        case 3:
            gridType = "Three";
            break;
        default:
            gridType = "More";
            break;
    }

    const imageElements = [...JSON.parse(images)].map((e, i) => {
        if (i < 3) {
            return (<img key={i} src={e} alt={e} onClick={() => {
                dispatch(openImageWindow());
                dispatch(setImages(JSON.parse(images)));
                dispatch(setImageIndex(i));
            }} />)
        }
    });

    if (!JSON.parse(images)) return null;

    return (
        <section className={`ImageGrid ImageGrid${gridType}`}>
            { imageElements }
        </section>
    )
}

export default ImageGrid;