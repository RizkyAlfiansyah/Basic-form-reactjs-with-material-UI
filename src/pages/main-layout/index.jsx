import React, {useState, useRef, useEffect} from 'react'
import { Box, Grid, Typography , Divider, OutlinedInput, InputAdornment, Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Style from './styles.module.scss'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { PickersDay } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { CalendarPickerSkeleton } from '@mui/x-date-pickers';
import fakeFetch from '../../utils/util';


const {root, form, input} = Style
const initialValue = new Date();
const MainLayout = () => {
    const requestAbortController = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedDays, setHighlightedDays] = useState([1, 2, 15]);
    const [detail, setDetail] = useState({
        name: 1,
        dc: 1,
        paymentType: 1,
        expiredDate: initialValue,
        notes: '',
    });

    const [product, setProduct] = useState({
        productName: 1,
        unit: 1,
        qty: 1,
        price: 700000,
        totalPrice: 0,
    })

    useEffect(() => {
        setProduct({
            ...product,
            totalPrice: product.qty * product.price,
        })
    } , [product.qty, product.price, detail.notes])

    const fetchHighlightedDays = (date) => {
        const controller = new AbortController();
        fakeFetch(date, {
        signal: controller.signal,
        })
        .then(({ daysToHighlight }) => {
            setHighlightedDays(daysToHighlight);
            setIsLoading(false);
        })
        .catch((error) => {
            if (error.name !== 'AbortError') {
            throw error;
            }
        });
        requestAbortController.current = controller;
    };

    React.useEffect(() => {
        fetchHighlightedDays(initialValue);
        return () => requestAbortController.current?.abort();
    }, []);

    const handleMonthChange = (date) => {
        if (requestAbortController.current) {
        requestAbortController.current.abort();
        }

        setIsLoading(true);
        setHighlightedDays([]);
        fetchHighlightedDays(date);
    };
  return (
    <Box sx={{ width:'100%', height: '100%', backgroundColor: '#fff' }}>
       <div className={root}>
        <Grid container >
            <Grid item xs={3}>
                <Typography variant="subtitle2" style={{fontWeight: '700'}}>
                    Detail
                </Typography>
            </Grid>
            <Grid item xs={9} className={form}>
                <Grid item xs={9} style={{ width: '100%' }}>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <Typography variant='subtitle2' style={{fontWeight: '500'}}>Name <span style={{ color: 'red' }}>*</span></Typography>
                        <Select
                        value={detail.name}
                        onChange={(v) => {
                            setDetail({
                                ...detail,
                                name: v.target.value,
                            });
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value={1}>
                            <em>Garret Winters</em>
                        </MenuItem>
                        <MenuItem value={2}>Scarlett Johanson</MenuItem>
                        <MenuItem value={3}>Chris Hemsworth</MenuItem>
                        <MenuItem value={4}>Tom Holland</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={7} style={{ width: '100%' }}>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <Typography variant='subtitle2' style={{fontWeight: '500'}}>Distribution Center <span style={{ color: 'red' }}>*</span></Typography>
                        <Select
                        value={detail.dc}
                        onChange={(v) => {
                            setDetail({
                                ...detail,
                                dc: v.target.value,
                            });
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value={1}>
                            <em>DC Tangerang</em>
                        </MenuItem>
                        <MenuItem value={2}>DC Bekasi</MenuItem>
                        <MenuItem value={3}>DC Jakarta</MenuItem>
                        <MenuItem value={4}>DC Bogor</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container spacing={2} style={{ padding: '0px' }}>
                    <Grid item xs style={{ width: '100%' }}>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <Typography variant='subtitle2' style={{fontWeight: '500'}}>Payment Type <span style={{ color: 'red' }}>*</span></Typography>
                                <Select
                                value={detail.paymentType}
                                onChange={(v) => {
                                    setDetail({
                                        ...detail,
                                        paymentType: v.target.value,
                                    });
                                }}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                >
                                <MenuItem value={1}>
                                    <em>Cash H+1</em>
                                </MenuItem>
                                <MenuItem value={2}>Cash H+2</MenuItem>
                                <MenuItem value={3}>Kredit </MenuItem>
                                </Select>
                            </FormControl>
                    </Grid>
                    <Grid item xs style={{ width: '100%' }}>
                        <Typography variant='subtitle2' style={{fontWeight: '500', marginTop: '8px'}}>Expired Date<span style={{ color: 'red' }}>*</span></Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns} style={{ width: '100%' }}>
                            <DatePicker
                                value={detail.expiredDate}
                                loading={isLoading}
                                onChange={(v) => {
                                setDetail({
                                    ...detail,
                                    expiredDate: v.target.value,
                                });
                                }}
                                onMonthChange={handleMonthChange}
                                renderInput={(params) => <TextField {...params} />}
                                renderLoading={() => <CalendarPickerSkeleton />}
                                renderDay={(day, _value, DayComponentProps) => {
                                const isSelected =
                                    !DayComponentProps.outsideCurrentMonth &&
                                    highlightedDays.indexOf(day.getDate()) > 0;

                                return (
                                    <Badge
                                    key={day.toString()}
                                    overlap="circular"
                                    badgeContent={isSelected ? '🌚' : undefined}
                                    >
                                    <PickersDay {...DayComponentProps} />
                                    </Badge>
                                );
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid item xs={9} style={{ width: '100%' }}>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <Typography variant='subtitle2' style={{fontWeight: '500'}}>Notes</Typography>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            defaultValue={detail.notes}
                            onChange={(v) => {
                                setDetail({
                                    ...detail,
                                    notes: v.target.value,
                                });
                            }}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
        <Divider style={{marginTop : '20px'}} />
       </div>
       <div className={root}>
        <Grid container >
            <Grid item xs={3}>
                <Typography variant="subtitle2" style={{fontWeight: '700'}}>
                    Products
                </Typography>
            </Grid>
            <Grid item xs>
                <Grid item xs={10} className={form}>
                    <Grid container spacing={2} style={{ padding: '0px' }}>
                        <Grid item xs={9} style={{ width: '100%' }}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <Typography variant='subtitle2' style={{fontWeight: '500'}}>Product <span style={{ color: 'red' }}>*</span></Typography>
                                    <Select
                                    value={product.productName}
                                    onChange={(v) => {
                                        setProduct({
                                            ...product,
                                            productName: v.target.value,
                                        });
                                    }}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem value={1}>
                                        <em>Greenfield Full Cream Milk 1L</em>
                                    </MenuItem>
                                    <MenuItem value={2}>Low Fat Milk 1L</MenuItem>
                                    </Select>
                                </FormControl>
                        </Grid>
                        <Grid item xs style={{ width: '100%' }}>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                    <Typography variant='subtitle2' style={{fontWeight: '500'}}>Unit <span style={{ color: 'red' }}>*</span></Typography>
                                    <Select
                                    value={product.unit}
                                    onChange={(v) => {
                                        setProduct({
                                            ...product,
                                            unit: v.target.value,
                                        });
                                    }}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem value={1}>
                                        <em>Karton</em>
                                    </MenuItem>
                                    <MenuItem value={2}>Plastik</MenuItem>
                                    </Select>
                                </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ padding: '0px' }}>
                        <Grid item xs={3} style={{ width: '100%' }}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <Typography variant='subtitle2' style={{fontWeight: '500'}}>Quantity <span style={{ color: 'red' }}>*</span></Typography>
                                    <TextField fullWidth
                                        value={product.qty}
                                        onChange={(v) => {
                                        setProduct({
                                            ...product,
                                            qty: v.target.value,
                                        });
                                        }}
                                    />
                                </FormControl>
                        </Grid>
                        <Grid item xs={3} style={{ width: '100%' }}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <Typography variant='subtitle2' style={{fontWeight: '500'}}>Price <span style={{ color: 'red' }}>*</span></Typography>
                                    <TextField fullWidth 
                                        value={product.price}
                                        onChange={(v) => {
                                        setProduct({
                                            ...product,
                                            price: v.target.value,
                                        });
                                        }}
                                    />
                                </FormControl>
                        </Grid>
                        <Grid item xs style={{ width: '100%' }}>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                    <Typography variant='subtitle2' style={{fontWeight: '500', textAlign: 'right'}}>Total Price <span style={{ color: 'red' }}>*</span></Typography>
                                    <OutlinedInput
                                        disabled
                                        id="outlined-adornment-weight"
                                        value=""
                                        endAdornment={<InputAdornment position="end">{product.totalPrice}</InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{
                                        'aria-label': 'weight',
                                        }}
                                    />
                            </FormControl>
                            <hr />
                            <Grid container style={{justifyContent: 'space-between'}}>
                                <Typography variant='subtitle1' style={{fontWeight: '700', textAlign: 'left'}}>Total Nett Price</Typography>
                                <Typography variant='subtitle1' style={{fontWeight: '700', textAlign: 'right'}}>{product.totalPrice}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button variant="contained" endIcon={<AddIcon />} style={{backgroundColor : "#FFD24C"}}>
                        NEW ITEM
                    </Button>
                    <Grid container style={{justifyContent: 'flex-end', gap: '220px'}}>
                        <Typography variant='subtitle1' style={{fontWeight: '700', textAlign: 'left'}}>Total</Typography>
                        <Typography variant='subtitle1' style={{fontWeight: '700', textAlign: 'right'}}>{product.totalPrice}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Divider style={{margin : '20px 0px'}} />
        <Grid container style={{justifyContent: 'flex-end', gap: '20px'}}>
            <Button size="medium" style={{color: '#000', fontWeight: '600'}}>Cancel</Button>
            <Button variant="contained" size="medium" style={{backgroundColor : "#4E944F", color: '#fff', fontWeight: '600'}}> Confirm</Button>
        </Grid>
       </div>
    </Box>
  )
}

export default MainLayout