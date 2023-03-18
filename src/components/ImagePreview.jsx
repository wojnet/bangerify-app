const ImagePreview = ({ id, imageElement, deleteInputImage }) => {
    return (
        <div className="ImagePreview">
            <img src={URL.createObjectURL(imageElement)} />
            <button onClick={() => deleteInputImage(id)}>x</button>
        </div>
    );
}

export default ImagePreview;