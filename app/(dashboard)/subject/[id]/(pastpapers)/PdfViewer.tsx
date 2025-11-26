import Navbar from '@/components/Navbar';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function PdfViewer() {
    const { url, title, year } = useLocalSearchParams<{ url: string; title: string; year: string }>();

    const source = { uri: url, cache: true };

    return (
        <View className="flex-1 bg-background-light">
            <Navbar
                heading={title || 'Past Paper'}
                subHeading={year || 'View Paper'}
                showBackButton={true}
            />

            <View className="flex-1 justify-center items-center">
                <Pdf
                    trustAllCerts={false}
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                    renderActivityIndicator={() => (
                        <ActivityIndicator size="large" color="#5470FD" />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});
