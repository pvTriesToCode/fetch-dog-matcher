import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Container, Typography, Button, Box, CircularProgress, Alert,
    FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
    Pagination,
    Checkbox, ListItemText, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import CloseIcon from '@mui/icons-material/Close';

import DogCard, { Dog } from '../components/DogCard';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';
const RESULTS_PER_PAGE = 24;

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [isLoadingBreeds, setIsLoadingBreeds] = useState<boolean>(false);
    const [breedsError, setBreedsError] = useState<string | null>(null);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [isLoadingDogs, setIsLoadingDogs] = useState<boolean>(false);
    const [dogsError, setDogsError] = useState<string | null>(null);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<string>('breed:asc');
    const [favoriteDogIds, setFavoriteDogIds] = useState<Set<string>>(new Set());
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [isMatching, setIsMatching] = useState<boolean>(false);
    const [matchError, setMatchError] = useState<string | null>(null);
    const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);

    const findMatchButtonRef = useRef<HTMLButtonElement>(null);
    const modalTitleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const fetchBreeds = async () => {
             setIsLoadingBreeds(true);
             setBreedsError(null);
             try {
                 const response = await fetch(`${API_BASE_URL}/dogs/breeds`, { credentials: 'include' });
                 if (response.status === 401) { navigate('/login'); return; }
                 if (!response.ok) { throw new Error(`Failed to fetch breeds: ${response.status}`); }
                 const breedsData: string[] = await response.json();
                 setBreeds(breedsData.sort());
             } catch (error) {
                 console.error('Error fetching breeds:', error);
                 const message = error instanceof Error ? error.message : 'An unknown error occurred fetching breeds.';
                 if (!message.includes('401')) { setBreedsError(message); }
             } finally {
                 setIsLoadingBreeds(false);
             }
        };
        fetchBreeds();
    }, [navigate]);

    const fetchDogs = useCallback(async (page = 1) => {
         setIsLoadingDogs(true);
         setDogsError(null);
         if (page === 1) setDogs([]);

         const fromOffset = (page - 1) * RESULTS_PER_PAGE;
         const params = new URLSearchParams();
         params.append('size', String(RESULTS_PER_PAGE));
         params.append('sort', sortOrder);
         if (fromOffset > 0) { params.append('from', String(fromOffset)); }
         selectedBreeds.forEach(breed => params.append('breeds', breed));

         const url = `${API_BASE_URL}/dogs/search?${params.toString()}`;

         try {
             const searchResponse = await fetch(url, { credentials: 'include' });
             if (searchResponse.status === 401) { navigate('/login'); return; }
             if (!searchResponse.ok) { throw new Error(`Search failed: ${searchResponse.status}`); }

             const searchData = await searchResponse.json();
             const dogIds: string[] = searchData.resultIds || [];
             setTotalResults(searchData.total || 0);
             setCurrentPage(page);

             if (dogIds.length === 0) { setDogs([]); setTotalResults(0); return; }

             const detailsResponse = await fetch(`${API_BASE_URL}/dogs`, {
                 method: 'POST', headers: { 'Content-Type': 'application/json' },
                 credentials: 'include', body: JSON.stringify(dogIds),
             });
             if (detailsResponse.status === 401) { navigate('/login'); return; }
             if (!detailsResponse.ok) { throw new Error(`Details fetch failed: ${detailsResponse.status}`); }

             const dogDetails: Dog[] = await detailsResponse.json();
             setDogs(dogDetails);

         } catch (error) {
             console.error('Error fetching dogs:', error);
             const message = error instanceof Error ? error.message : 'Unknown error fetching dogs.';
             if (!message.includes('401')) { setDogsError(message); }
         } finally {
             setIsLoadingDogs(false);
         }
    }, [navigate, selectedBreeds, sortOrder]);

    useEffect(() => {
        fetchDogs(1);
    }, [selectedBreeds, sortOrder, fetchDogs]);

    const handleLogout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (error) {
            console.error("Logout network error:", error);
        } finally {
            setIsLoggingOut(false);
            navigate('/login');
        }
     }, [navigate]);

    const handleBreedChange = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event;
        setSelectedBreeds(typeof value === 'string' ? value.split(',') : value);
     };

    const handleSortToggle = () => {
        setSortOrder(prev => (prev === 'breed:asc' ? 'breed:desc' : 'breed:asc'));
     };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        if (newPage !== currentPage) {
            fetchDogs(newPage);
        }
     };

    const handleToggleFavorite = useCallback((dogId: string) => {
        setFavoriteDogIds(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(dogId)) {
                newFavorites.delete(dogId);
            } else {
                newFavorites.add(dogId);
            }
            return newFavorites;
        });
     }, []);

    const handleFindMatch = useCallback(async () => {
         if (favoriteDogIds.size === 0) {
            setMatchError("Please select at least one favorite dog first!");
            setIsMatchModalOpen(true);
            return;
         }
         setIsMatching(true);
         setMatchError(null);
         setMatchedDog(null);
         const favoriteIdsArray = Array.from(favoriteDogIds);
         try {
             const matchResponse = await fetch(`${API_BASE_URL}/dogs/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(favoriteIdsArray),
             });
             if (matchResponse.status === 401) { navigate('/login'); return; }
             if (!matchResponse.ok) { throw new Error(`Match request failed: ${matchResponse.status}`); }
             const matchResult: { match: string } = await matchResponse.json();
             const matchedId = matchResult.match;
             const detailsResponse = await fetch(`${API_BASE_URL}/dogs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify([matchedId]),
             });
             if (detailsResponse.status === 401) { navigate('/login'); return; }
             if (!detailsResponse.ok) { throw new Error(`Matched dog details fetch failed: ${detailsResponse.status}`); }
             const dogDetails: Dog[] = await detailsResponse.json();
             if (dogDetails.length > 0) {
                setMatchedDog(dogDetails[0]);
             } else {
                throw new Error("Matched dog details could not be retrieved.");
             }
             setIsMatchModalOpen(true);
         } catch (error) {
             console.error('Error finding match:', error);
             const message = error instanceof Error ? error.message : 'Unknown error during matching.';
             if (!message.includes('401')) {
                setMatchError(message);
                setIsMatchModalOpen(true);
             }
         } finally {
             setIsMatching(false);
         }
     }, [favoriteDogIds, navigate]);

    const handleCloseMatchModal = () => {
        setIsMatchModalOpen(false);
        findMatchButtonRef.current?.focus();
     };

    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

    return (
        <Container component="main" maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
            <Box component="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" id="search-heading">
                    <PetsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Dog Matcher
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Button
                        ref={findMatchButtonRef}
                        variant="contained"
                        color="primary"
                        onClick={handleFindMatch}
                        disabled={favoriteDogIds.size === 0 || isMatching || isLoadingDogs}
                        sx={{ position: 'relative', minWidth: '160px' }}
                        aria-busy={isMatching}
                    >
                        <span style={{ visibility: isMatching ? 'hidden' : 'visible' }}>
                            Find Match ({favoriteDogIds.size} favs)
                        </span>
                        {isMatching && <CircularProgress size={24} sx={{ color: 'inherit', position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        sx={{ position: 'relative' }}
                    >
                        <span style={{ visibility: isLoggingOut ? 'hidden' : 'visible' }}>Logout</span>
                        {isLoggingOut && <CircularProgress size={24} sx={{ color: 'inherit', position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
                    </Button>
                </Box>
            </Box>

            <Box component="section" aria-label="Search Filters" sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl
                    sx={{
                        minWidth: 200,
                        maxWidth: { xs: '100%', sm: 300, md: 400 },
                    }}
                    disabled={isLoadingBreeds || !!breedsError}
                >
                    <InputLabel id="breed-multi-select-label">Filter by Breed</InputLabel>
                    <Select
                        labelId="breed-multi-select-label"
                        id="breed-multi-select"
                        multiple
                        value={selectedBreeds}
                        onChange={handleBreedChange}
                        label="Filter by Breed"
                        renderValue={(selected) => selected.length === 0 ? <em>All Breeds</em> : selected.join(', ')}
                        MenuProps={{
                            PaperProps: {
                                sx: { maxHeight: 300 }
                            }
                        }}
                    >
                        {isLoadingBreeds && <MenuItem value="" disabled><em>Loading breeds...</em></MenuItem>}
                        {breeds.map((breed) => (
                            <MenuItem key={breed} value={breed}>
                                <Checkbox checked={selectedBreeds.includes(breed)} />
                                <ListItemText primary={breed} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    startIcon={<SortByAlphaIcon />}
                    onClick={handleSortToggle}
                    disabled={isLoadingDogs}
                    aria-label={`Sort by breed ${sortOrder === 'breed:asc' ? 'ascending' : 'descending'}`}
                >
                    Breed: {sortOrder === 'breed:asc' ? 'A-Z' : 'Z-A'}
                </Button>
                {breedsError && <Alert severity="warning" sx={{ width: '100%' }} role="status">{breedsError}</Alert>}
            </Box>

            <Box component="section" aria-label="Search Results">
                 <Box sx={{ mb: 2 }} role="status" aria-live="polite">
                     {isLoadingDogs && <Typography>Loading dogs...</Typography>}
                     {dogsError && <Alert severity="error">Error loading dogs: {dogsError}</Alert>}
                     {!isLoadingDogs && !dogsError && (
                          <Typography variant="h6" component="h2" gutterBottom>
                              Results ({totalResults} dog{totalResults !== 1 ? 's' : ''} found)
                          </Typography>
                     )}
                 </Box>
                 {isLoadingDogs && !dogsError && ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress size={60} aria-label="Loading dogs" /></Box> )}
                {!isLoadingDogs && !dogsError && dogs.length === 0 && totalResults === 0 && ( <Typography sx={{ textAlign: 'center', my: 5 }}>No dogs found matching your criteria.</Typography> )}

                {!isLoadingDogs && !dogsError && dogs.length > 0 && (
                    <Grid container spacing={isMobile ? 2 : 3} aria-labelledby="search-heading">
                        {dogs.map((dog) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dog.id}>
                                <DogCard
                                    dog={dog}
                                    isFavorite={favoriteDogIds.has(dog.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {totalPages > 1 && !isLoadingDogs && !dogsError && (
                    <Box component="nav" aria-label="Dog search results pagination" sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                            disabled={isLoadingDogs}
                            siblingCount={isMobile ? 0 : 1}
                            boundaryCount={isMobile ? 1 : 1}
                        />
                    </Box>
                 )}
            </Box>

            <Dialog
                 open={isMatchModalOpen}
                 onClose={handleCloseMatchModal}
                 aria-labelledby="match-dialog-title"
                 aria-describedby={matchedDog ? `match-dialog-content-${matchedDog.id}` : undefined}
                 TransitionProps={{
                    onEntered: () => modalTitleRef.current?.focus()
                 }}
             >
                <DialogTitle id="match-dialog-title" ref={modalTitleRef} tabIndex={-1}>
                    {matchError ? "Match Error" : (matchedDog ? "We Found Your Match!" : "Finding Match...")}
                     <IconButton
                         aria-label="close match dialog"
                         onClick={handleCloseMatchModal}
                         sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                     >
                         <CloseIcon />
                     </IconButton>
                 </DialogTitle>
                <DialogContent dividers id={matchedDog ? `match-dialog-content-${matchedDog.id}` : undefined}>
                    {matchError && ( <Alert severity="error" role="alert">{matchError}</Alert> )}
                    {!matchError && matchedDog && (
                        <Box sx={{ pt: 1 }}>
                            <DogCard
                                dog={matchedDog}
                                isFavorite={favoriteDogIds.has(matchedDog.id)}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        </Box>
                     )}
                    {!matchError && !matchedDog && ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}> <CircularProgress aria-label="Loading match details" /> </Box> )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMatchModal}>Close</Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default SearchPage;
