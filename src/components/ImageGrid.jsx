const ImageGrid = ({ images, setImageWindowState }) => {

    var gridType;

    switch(images.length) {
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

    const imageElements = images.map((e, i) => {
        if (i < 3) {
            return (<img key={i} src={e} alt={e} onClick={() => {
                setImageWindowState(prev => {
                    return {
                        ...prev,
                        isOpen: true,
                        images: images,
                        index: i
                    }
                });
            }} />)
        }
    });

    return (
        <section className={`ImageGrid ImageGrid${gridType}`}>
            { imageElements }
        </section>
    )
}

export default ImageGrid;