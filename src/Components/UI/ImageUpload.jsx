import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {COLOR} from '../../Constants/Colors';
import {images} from './images'; // cross, upload, pdfIcon, documentIcon
import ImageModal from './ImageModal';

const ImageUpload = ({file, setFile = () => {}}) => {
  // const [file, setFile] = useState(externalFile || null);
  const [showModal, setShowModal] = useState(false);

  // check if file is image
  const isImageFile = f =>
    f?.type?.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(f?.name || '');

  // check if file is PDF
  const isPdfFile = f =>
    f?.type === 'application/pdf' || /\.pdf$/i.test(f?.name || '');

  // get file name
  const getFileName = f => f?.name || f?.uri?.split('/').pop() || 'Untitled';

  // get file size in KB / MB
  const getFileSize = f => {
    if (!f?.size) return '';
    const sizeInKB = f.size / 1024;
    if (sizeInKB < 1024) return `${sizeInKB.toFixed(1)} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  // preview doc (for PDFs / docs, open in browser or viewer)
  const handleFilePreview = async f => {
    if (f?.uri) {
      try {
        await Linking.openURL(f.uri);
      } catch (err) {
        console.log('Preview error:', err);
      }
    }
  };

  // Render preview
  const renderFileUploadPreview = () => {
    if (!file) return null;

    if (isImageFile(file)) {
      return (
        <View style={styles.fileWrapper}>
          <Image
            source={{uri: file.uri || file.path}}
            style={styles.previewImg}
          />
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              setFile(null);
              onChangeFile?.(null);
            }}>
            <Image source={images.close} style={styles.deleteIcon} />
          </TouchableOpacity>
          <View style={styles.fileInfoOverlay}>
            <Text style={styles.fileInfoText}>{getFileName(file)}</Text>
            <Text style={styles.fileInfoText}>{getFileSize(file)}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.documentWrapper}>
          <TouchableOpacity
            style={styles.documentPreview}
            onPress={() => handleFilePreview(file)}>
            <Image
              source={isPdfFile(file) ? images.doc : images.doc}
              style={styles.documentIcon}
            />
            <View style={styles.documentInfo}>
              <Text style={styles.documentName} numberOfLines={1}>
                {getFileName(file)}
              </Text>
              <Text style={styles.documentType}>
                {isPdfFile(file) ? 'PDF Document' : 'Document'} •{' '}
                {getFileSize(file)}
              </Text>
              <Text style={styles.documentSource}>
                From: {file.source || 'Unknown'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtnDocument}
            onPress={() => {
              setFile(null);
              onChangeFile?.(null);
            }}>
            <Image source={images.close} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const handleFileSelected = (response, source) => {
    console.log('selected file-->>>', source, response);
    if (response) {
      // Normalize the file object based on the source
      const normalizedFile = normalizeFileObject(response, source);
      setFile(normalizedFile);
    }
    setShowModal(false);
  };

  // Normalize file object from different sources
  const normalizeFileObject = (fileData, source) => {
    let normalized = {
      source: source,
      originalData: fileData, // Keep original data for reference
    };

    switch (source) {
      case 'camera':
        // Camera returns: {name, type, uri}
        normalized = {
          ...normalized,
          uri: fileData.uri,
          name: fileData.name,
          type: fileData.type,
          mime: fileData.type,
          path: fileData.uri,
          filename: fileData.name,
          size: fileData.size || 0,
        };
        break;

      case 'gallery':
        // Gallery returns: {uri, type, name, ...}
        normalized = {
          ...normalized,
          uri: fileData.uri,
          name: fileData.name || `image_${Date.now()}.jpg`,
          type: fileData.type,
          mime: fileData.type,
          path: fileData.uri,
          filename: fileData.name || `image_${Date.now()}.jpg`,
          size: fileData.size || 0,
        };
        break;

      case 'document':
        // Document picker returns: {uri, type, name, size, ...}
        normalized = {
          ...normalized,
          uri: fileData.uri,
          name: fileData.name,
          type: fileData.type,
          mime: fileData.type,
          path: fileData.uri,
          filename: fileData.name,
          size: fileData.size || 0,
          nativeType: fileData.nativeType,
        };
        break;

      default:
        // Default handling
        normalized = {
          ...normalized,
          uri: fileData.uri || fileData.path,
          name: fileData.name || fileData.filename || `file_${Date.now()}`,
          type: fileData.type || fileData.mime || 'application/octet-stream',
          mime: fileData.mime || fileData.type || 'application/octet-stream',
          path: fileData.path || fileData.uri,
          filename: fileData.filename || fileData.name || `file_${Date.now()}`,
          size: fileData.size || 0,
        };
    }

    console.log('Normalized file:', normalized);
    return normalized;
  };
  return (
    <>
      {file ? (
        renderFileUploadPreview()
      ) : (
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => setShowModal(true)}>
          <View style={styles.uploadContent}>
            <Image source={images.upload} style={styles.uploadIcon} />
            <Text style={styles.uploadTitle}>Upload File</Text>
            <Text style={styles.uploadSubtitle}>JPG / PNG / PDF only</Text>
          </View>
        </TouchableOpacity>
      )}
      <ImageModal
        showModal={showModal}
        close={() => setShowModal(false)}
        selected={handleFileSelected}
        documents={true}
      />
    </>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  uploadBox: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(121, 111, 195, 0.08)',
    borderStyle: 'dashed',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
    tintColor: COLOR.primary,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.primary,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#666',
  },

  // IMAGE PREVIEW
  fileWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 10,
  },
  previewImg: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  deleteBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  deleteIcon: {
    width: 16,
    height: 16,
  },
  fileInfoOverlay: {
    marginTop: 5,
    alignItems: 'center',
  },
  fileInfoText: {
    fontSize: 12,
    color: '#333',
  },

  // DOCUMENT PREVIEW
  documentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    position: 'relative',
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  documentType: {
    fontSize: 12,
    color: '#666',
  },
  documentSource: {
    fontSize: 11,
    color: '#999',
  },
  deleteBtnDocument: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 5,
    borderRadius: 20,
  },
});
