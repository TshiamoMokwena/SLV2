import CameraButton from '@/components/CameraButton';
import { useFileContext } from '@/context/FileProvider';
import { useOnboarding } from '@/context/OnboardingProvider';
import { analyzeImage } from '@/utils/ocr';
import { FontAwesome5 } from '@expo/vector-icons';
import { RelativePathString, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';

const CameraScreen = () => {
    const {
        setocrFileContents,
        setFileUri,
    } = useFileContext();
    const { activeSubject } = useOnboarding();
    const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");
    const [flash, setFlash] = useState<"off" | "on">("off");
    const [torch, setTorch] = useState<"off" | "on">("off");
    const [exposure, setExposure] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const router = useRouter();

    const camera = useRef<Camera>(null);
    const device = useCameraDevice(cameraPosition);
    const format = useCameraFormat(device, [
        { photoHdr: true },
    ]);

    const [zoom, setZoom] = useState(device?.neutralZoom || 1);

    const takePicture = async () => {
        try {
            if (camera.current == null) throw new Error("Camera ref is null");

            console.log("Taking picture...");
            setIsProcessing(true);

            const photo = await camera.current.takePhoto({
                flash: flash,
                enableShutterSound: true,
            });

            if (photo == null) throw new Error("Photo is null");

            if (photo) {
                console.log("Photo taken:", photo.path);
                const fileUri = 'file://' + photo.path;
                setFileUri(fileUri);

                const ocrContent = await analyzeImage(fileUri);

                if (ocrContent && ocrContent.responses && ocrContent.responses[0].fullTextAnnotation) {
                    setocrFileContents(ocrContent.responses[0].fullTextAnnotation.text);
                    router.dismissAll();
                    router.push(`/(dashboard)/subject/${activeSubject?.subjectId}/(homework)/OCRConfirm` as RelativePathString);
                } else {
                    Alert.alert("No Text Found", "Could not detect any text in the image.");
                }
            } else {
                Alert.alert("Error", "An error occured while trying to take a picture");
            }

        } catch (error: any) {
            console.log("Failed to take picture", error);
            Alert.alert('Error', error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!device) return <View style={styles.container} />;

    return (
        <View style={styles.container}>
            <View style={{ flex: 3, borderRadius: 10, overflow: "hidden", backgroundColor: "black" }}>
                <Camera
                    ref={camera}
                    style={{ flex: 1 }}
                    device={device}
                    format={format}
                    photoHdr={format?.supportsPhotoHdr}
                    isActive={true}
                    zoom={zoom}
                    resizeMode='cover'
                    exposure={exposure}
                    torch={torch}
                    video={false}
                    photo={true}
                />
                {isProcessing && (
                    <View style={StyleSheet.absoluteFill} className="justify-center items-center bg-black/50">
                        <ActivityIndicator size="large" color="#5470FD" />
                    </View>
                )}
            </View>

            <View style={{ flex: 1, backgroundColor: "black" }}>
                <View style={{ flex: 0.7, flexDirection: "row", justifyContent: "space-evenly", }}>
                    <CameraButton
                        iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
                        onPress={() => setTorch((t) => (t === "off" ? "on" : "off"))}
                        containerStyle={{ alignSelf: "center" }}
                    />
                    <CameraButton
                        iconName={flash === "on" ? "flash-outline" : "flash-off-outline"}
                        onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
                        containerStyle={{ alignSelf: "center" }}
                    />
                    <CameraButton
                        iconName="camera-reverse-outline"
                        onPress={() =>
                            setCameraPosition((p) => (p === "back" ? "front" : "back"))
                        }
                        containerStyle={{ alignSelf: "center" }}
                    />
                    <CameraButton
                        iconName="image-outline"
                        onPress={() => {
                            const link = Platform.select({
                                ios: "photos-redirect://",
                                android: "content://media/external/images/media",
                            });
                            Linking.openURL(link!);
                        }}
                        containerStyle={{ alignSelf: "center" }}
                    />
                </View>

                <View style={{
                    flex: 1.1,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                }}>
                    <TouchableOpacity onPress={takePicture} disabled={isProcessing}>
                        <FontAwesome5 name="dot-circle" size={55} color={isProcessing ? "gray" : "white"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "black",
    },
});
