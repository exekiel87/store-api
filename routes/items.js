const express = require('express');
const Boom = require('@hapi/boom');
const axios = require('axios');

module.exports = function run(){

    const router = express.Router();

    router.get('/api/items',
        async function({query}, res, next) {
            try
            {
                const {q} = query;

                const url = 'https://api.mercadolibre.com/sites/MLA/search?q=' + q;

                const result = await axios.get(url);

                const dataResult = result.data;

                const data = {
                    author: {
                        name: "",
                        lastname: ""
                    },
                    categories: ['Electrónica, Audio y Video','iPod','Reproductores','iPod touch', '32 GB'],
                    items: 
                    dataResult.results.map((item) => {                       
                            return {
                                id: item.id,
                                title: item.title,
                                price: {
                                    currency: item.currency_id,
                                    amount: item.price,
                                    decimals: 2,
                                },
                                picture: item.thumbnail,
                                condition: item.condition === 'new'? 'nuevo': 'usado',
                                free_shipping: item.shipping && item.shipping.free_shipping
                            }
                        }) || []
                    }

                res.status(200).send(data);
            }
            catch (err)
            {
                next(err);
            }
        }
    );

    router.get('/api/items/:id',
        async function({params}, res, next) {
            try
            {
                const {id} = params;

                const url = 'https://api.mercadolibre.com/items/' + id;

                const itemReq = axios.get(url);
                const descriptionReq = axios.get(url + '/description');

                let [itemRes, descriptionRes] = await Promise.all([itemReq, descriptionReq]);

                let item = itemRes.data;
                let description = descriptionRes.data;

                const data = {
                    author: {
                        name: "",
                        lastname: ""
                    },
                    categories: ['Electrónica, Audio y Video','iPod','Reproductores','iPod touch', '32 GB'],
                    item: {
                        id: item.id,
                        title: item.title,
                        price: {
                            currency: item.currency_id,
                            amount: item.price,
                            decimals: 2,
                        },
                        picture: item.pictures[0].secure_url,
                        condition: item.condition === 'new'? 'nuevo': 'usado',
                        free_shipping: item.shipping && item.shipping.free_shipping,
                        sold_quantity: item.sold_quantity,
                        description: description.plain_text
                    }
                    }

                res.status(200).send(data);
            }
            catch (err)
            {
                next(err);
            }
        }
    );

    return router;
}