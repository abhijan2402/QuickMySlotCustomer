import React from 'react';
import { Modal, TouchableOpacity, Image, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageShowModal = ({ visible, onClose, data, startIndex = 0 }) => {

    // Format images for ImageViewer
    const formattedImages = data?.map(item => ({
        url: item.image_url
    })) || [];

    return (
        <Modal
            visible={visible}
            transparent
            onRequestClose={onClose}
        >
            {/* Close button */}
            <TouchableOpacity
                onPress={onClose}
                style={{
                    position: 'absolute',
                    top: 40,
                    right: 20,
                    zIndex: 999,
                    padding: 10
                }}
            >
                <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/128/1828/1828778.png" }} // <-- your cross icon here
                    style={{ width: 20, height: 20, tintColor: '#fff', marginTop: 20 }}
                />
            </TouchableOpacity>

            <ImageViewer
                imageUrls={formattedImages}
                index={startIndex}        // <-- HERE (starts viewer from tapped image)
                enableSwipeDown
                onSwipeDown={onClose}
                onCancel={onClose}
                renderIndicator={() => null}
            />
        </Modal>
    );
};

export default ImageShowModal;
