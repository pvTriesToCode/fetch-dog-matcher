import React from 'react';
import {
    Card, CardMedia, CardContent, Typography, IconButton, Box, Chip
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

export interface DogCardProps {
    dog: Dog;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    cardRef?: React.RefObject<HTMLDivElement>;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite, cardRef }) => {
    return (
        <Card
            ref={cardRef}
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, position: 'relative', transition: 'box-shadow 0.3s ease-in-out', '&:hover': { boxShadow: 3 } }}
            role="article"
            aria-labelledby={`dog-name-${dog.id}`}
        >
            <IconButton
                aria-label={isFavorite ? `Remove ${dog.name} from favorites` : `Add ${dog.name} to favorites`}
                onClick={() => onToggleFavorite(dog.id)}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}
            >
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>

            <CardMedia
                component="img"
                onError={(e) => (e.currentTarget.src = `https://placehold.co/300x200/cccccc/ffffff?text=${dog.breed}`)}
                image={dog.img}
                alt={`${dog.name}, a ${dog.breed}`}
                loading="lazy"
                sx={{ height: 200, objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" id={`dog-name-${dog.id}`}>
                    {dog.name}
                    <Typography
                        variant="body1"
                        component="span"
                        sx={{ ml: 1, color: 'text.secondary' }}
                    >
                         ({dog.age} yrs)
                    </Typography>
                </Typography>
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                     <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                         Breed:
                     </Typography>
                     <Chip label={dog.breed} size="small" color="primary" variant="outlined" />
                 </Box>
                <Typography variant="body2" color="text.secondary">
                    Zip: {dog.zip_code}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DogCard;
