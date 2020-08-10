import React, { useState } from 'react';
import { View, Text, Image,  Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

export interface Teacher {
    id: number;
    avatar: string;
    bio: string;
    cost: number;
    name: string;
    subject: string;
    whatsapp: string;
}

interface TeacherItemProps {
    teacherInfo: Teacher,
    favorited: boolean;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacherInfo, favorited }) => {

    const [isFavorited, setIsFavorited] = useState(favorited);

    function handleLinkToWhatsapp() {
        api.post('connections', {
            user_id: teacherInfo.id,
        })
        Linking.openURL(`whatsapp://send?phone=${teacherInfo.whatsapp}`)
    }

    async function handleToggleFavorite() {

        const favorites = await AsyncStorage.getItem('favorites');
        let favoritesArray =[];

        if(favorites) {
            favoritesArray = JSON.parse(favorites);
        }

        if(isFavorited) {
            const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
                return teacherItem.id === teacherInfo.id
            });

            favoritesArray.splice(favoriteIndex, 1);
            setIsFavorited(false);
            
        } else {
            
            favoritesArray.push(teacherInfo);

            setIsFavorited(true);
            
        }

        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    }



    return(
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image 
                    style={styles.avatar} 
                    source={{ uri: teacherInfo.avatar }}
                />

                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{teacherInfo.name}</Text>
                    <Text style={styles.subject}>{teacherInfo.subject}</Text>
                </View>
            </View>
            <Text style={styles.bio}>
                {teacherInfo.bio}
            </Text>
            <View style={styles.footer}>
                <Text style={styles.price}>
                    Preço/hora {'   '}
                    <Text style={styles.priceValue}>{teacherInfo.cost}</Text>
                </Text>

                <View style={styles.buttonContainer}>
                    <RectButton 
                        onPress={handleToggleFavorite}
                        style={[
                        styles.favoriteButton, 
                        isFavorited ? styles.favorited : {}
                    ]}
                    >
                        {isFavorited
                            ? <Image source={unfavoriteIcon} />
                            : <Image source={heartOutlineIcon} />
                        }

                        
                    </RectButton>

                    <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
                        <Image source={whatsappIcon} />
                        <Text style={styles.contactButtonText}>Entrar em contato</Text>
                    </RectButton>
                </View>
            </View>
        </View>
    )
}

export default TeacherItem;