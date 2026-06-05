import {Router} from 'express';
//
import {validateBody, validateParams, validateQuery} from '../middleware/validations';
import {z} from 'zod';
//
import db from '../db/connection';
import {vehicles, vehicle_brands, vehicles_categories, vehicles_fuel_types} from '../db/schema';
import {eq, sql} from 'drizzle-orm';

const createCarSchema = z.object({
    brand: z.string(),
    model: z.string(),
    year: z.number().int().min(2010).max(new Date().getFullYear())
});

const getCarSchema = z.object({
    id: z.string()
});

const router = Router();

router.get('/', async(req, res) =>{
    //res.status(200).json({ message: 'List of cars' });
    try{
        const results = await db
            .select({
                id: vehicles.id,
                model: vehicles.model,
                year: vehicles.year,
                description: vehicles.description,
                created_at: vehicles.created_at,
                updated_at: vehicles.updated_at,
                brand_id: vehicles.brand_id,
                brand_name: vehicle_brands.name,
                category_id: vehicles.category_id,
                category_name: vehicles_categories.name,
                fuel_type_id: vehicles.fuel_type_id,
                fuel_type_name: vehicles_fuel_types.name
            })
            .from(vehicles)
            .leftJoin(vehicle_brands, eq(vehicles.brand_id, vehicle_brands.id))
            .leftJoin(vehicles_categories, eq(vehicles.category_id, vehicles_categories.id))
            .leftJoin(vehicles_fuel_types, eq(vehicles.fuel_type_id, vehicles_fuel_types.id));

            //transform results to desired format
            const cars = results.map( row => ({
                id: row.id,
                model: row.model,
                year: row.year,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                brand:{
                    id: row.brand_id,
                    name: row.brand_name
                },
                category:{
                    id: row.category_id,
                    name: row.category_name
                },
                fuelType:{
                    id: row.fuel_type_id,
                    name: row.fuel_type_name
                }
            }));
            //cars is now an array of car objects with nested brand, category and fuelType
            res.status(200).json(cars);
    }catch(error){
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', validateParams(getCarSchema), (req, res) =>{
    res.status(200).json({message: `Details of car with id ${req.params.id}`});
});

router.post('/', validateBody(createCarSchema), (req, res) =>{
    res.status(201).json({message: 'Car created successfully'});
});

router.delete('/:id', validateBody(createCarSchema), (req, res) =>{
    res.status(200).json({message: `Car with id ${req.params.id} deleted successfully`});
});

export default router;