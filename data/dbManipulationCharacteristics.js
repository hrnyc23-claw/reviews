const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useCreateIndex: true });

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const characteristicsSchema = new Schema({id: {type: Number, index: true}, product_id: {type: Number, index: true}, name: String}, {collection: 'characteristics', _id: false});

const characterisiticReviewsSchema = new Schema({id: {type: Number, index: true}, characteristic_id: {type: Number, index: true}, review_id: Number, value: Number}, {collection: 'characteristic_reviews', _id: false});

const productCharacteristicsSchema = new Schema({product_id: {type: Number, index: true}, characteristics: Map}, {collection: 'productcharacteristicsaltered', _id: false});

const Characteristic = mongoose.model('Characteristic', characteristicsSchema);

const CharacteristicReview = mongoose.model('CharacteristicReview', characterisiticReviewsSchema);

const ProductCharacteristicAlteredMethod = mongoose.model('ProductCharacteristicAlteredMethod', productCharacteristicsSchema);

const productLimit = 1000011;

const productIncrement = 10000;

const runBatchUpload = async () => {
  for (let productIdLowerBound = 0; productIdLowerBound < productLimit; productIdLowerBound += productIncrement) {
    let productIdUpperBound = Math.min(productIdLowerBound + productIncrement, productLimit);
    console.log('lb', productIdLowerBound);
    console.log('ub', productIdUpperBound);
    await Characteristic.find({product_id: {$lte: productIdUpperBound, $gte: productIdLowerBound}}).sort({id: 1}).then(async characteristicsArray => {
      let charLowerBound = characteristicsArray[0].id;
      let charUpperBound = characteristicsArray[characteristicsArray.length - 1].id;
      await CharacteristicReview.find({characteristic_id: {$lte: charUpperBound, $gte: charLowerBound}}).sort({characteristic_id: 1}).then(async characteristicReviewArray => {
        let charReviewPointer = 0;
        for (let i = 0; i < characteristicsArray.length; i++) {
          let charId = characteristicsArray[i].id;
          let values = [];
          while (charReviewPointer < characteristicReviewArray.length && characteristicReviewArray[charReviewPointer].characteristic_id === charId) {
            let value = characteristicReviewArray[charReviewPointer].value;
            values.push(value);
            charReviewPointer++;
          }
          let productId = characteristicsArray[i].product_id;
          let productMap = await ProductCharacteristicAlteredMethod.findOne({product_id: productId});
          productMap = productMap ? productMap.characteristics : new Map();
          productMap.set(characteristicsArray[i].name, [...values]);
          await ProductCharacteristicAlteredMethod.updateOne({product_id: productId}, {characteristics: productMap}, {upsert: true});
        }
        console.log(`done with batch through characteristicId ${charUpperBound}`);
        return true;
      }).catch((err) => console.error(err));
      return true;
    }).catch((err) => console.error(err));
  }
}

runBatchUpload();

