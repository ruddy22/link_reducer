/**
 * @module queries.js
 * @author Petrov Alexey
 */

const Knex = require('knex');
const options = require('../knexfile');

const knex = Knex(options);
const LINKS = 'links';

/**
 * writes link info to db
 * @param {Object} link
 * @returns {Promise<Object>}
 */
const findOrCreate = async (link) => {
  const trx = await knex.transaction();
  const result = await trx(LINKS)
    .first(['original_link', 'short_link'])
    .where({ original_link: link.original_link })
    .then((record) => {
      if (record) {
        return record;
      }

      return trx(LINKS).insert(link).then(() => link);
    })
    .then((data) => {
      trx.commit();
      return {
        original: data.original_link,
        short: data.short_link,
      };
    })
    .catch(trx.rollback);

  return {
    status: 'ok',
    data: result,
  };
};

/**
 * get link info by code, if exists then update
 * @param {String} code
 * @returns {Promise<String>}
 */
const getLinkAndUpdate = async (code) => {
  const originalLink = 'original_link';
  const trx = await knex.transaction();
  const result = await trx(LINKS)
    .first([originalLink, 'transition_count'])
    .where({ generated_code: code })
    .then((record) => {
      if (!record) {
        return {};
      }

      return trx(LINKS).update({
        updated_at: Date.now(),
        transition_count: record.transition_count + 1,
      })
        .then(() => record);
    })
    .then((data) => {
      trx.commit();
      return data;
    })
    .catch(trx.rollback);

  return result[originalLink];
};

/**
 * module api
 */
module.exports = {
  findOrCreate,
  getLinkAndUpdate,
};
