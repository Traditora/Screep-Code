// 1. Require all your role modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const rolefab = require('role.fab');
const rolefab2 = require('role.fab2');
const roleupt = require('role.upt');
const roleh2 = require('role.h2');
const roleh3 = require('role.h3');
const rolescav = require('role.scav');
const roleh4 = require('role.h4');
const roleh5 = require('role.h5');
const roleh6 = require('role.h6'); // <-- ADDED
const roleh7 = require('role.h7'); // <-- ADDED
const roleHaul = require('role.haul');
const roleeff = require('role.eff'); 

// 2. Simply require the Traveler file. It sets itself up automatically.
require('Traveler');


module.exports.loop = function () {

    // Clear memory of dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // --- Creep Census ---
    // First, count all creeps of each role
    const harvesters = _.filter(Game.creeps, (c) => c.memory.role == 'harvester');
    const hauls = _.filter(Game.creeps, (c) => c.memory.role == 'haul');
    const h2s = _.filter(Game.creeps, (c) => c.memory.role == 'h2');
    const h3s = _.filter(Game.creeps, (c) => c.memory.role == 'h3');
    const upgraders = _.filter(Game.creeps, (c) => c.memory.role == 'upgrader');
    const builders = _.filter(Game.creeps, (c) => c.memory.role == 'builder');
    const fabs = _.filter(Game.creeps, (c) => c.memory.role == 'fab');
    const fab2s = _.filter(Game.creeps, (c) => c.memory.role == 'fab2');
    const upts = _.filter(Game.creeps, (c) => c.memory.role == 'upt');
    const h4s = _.filter(Game.creeps, (c) => c.memory.role == 'h4');     
    const scavs = _.filter(Game.creeps, (c) => c.memory.role == 'scav'); 
    const h5s = _.filter(Game.creeps, (c) => c.memory.role == 'h5');
    const h6s = _.filter(Game.creeps, (c) => c.memory.role == 'h6'); // <-- ADDED
    const h7s = _.filter(Game.creeps, (c) => c.memory.role == 'h7'); // <-- ADDED
    const effs = _.filter(Game.creeps, (c) => c.memory.role == 'eff');

    // --- ADDED: Console log for creep counts ---
    console.log(`Roles: H:${harvesters.length}, Haul:${hauls.length}, H2:${h2s.length}, H3:${h3s.length}, H4:${h4s.length}, H5:${h5s.length}, H6:${h6s.length}, H7:${h7s.length}, U:${upgraders.length}, B:${builders.length}, F:${fabs.length}, S:${scavs.length}, UPT:${upts.length}`);
    console.log(`Total Creeps: ${Object.keys(Game.creeps).length}`);


    // --- Tiered Spawning Logic ---
    // The 'else if' structure creates a priority queue.
    // It will only try to spawn a creep if all the tiers above it are full.
    if (hauls.length < 2) {
        // PRIORITY 1: Haulers
        Game.spawns['S1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 'Haul' + Game.time,
            { memory: { role: 'haul' } });
    }
    else if (harvesters.length < 2) {
        // PRIORITY 2: Harvesters
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 'Harvester' + Game.time,
            { memory: { role: 'harvester' } });
    }
    else if (upgraders.length < 2) {
        // PRIORITY 3: Upgraders
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + Game.time,
            { memory: { role: 'upgrader' } });
    }
    else if (effs.length < 3) {
        // PRIORITY 4: Eff hauler
        Game.spawns['S1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Eff' + Game.time,
            { memory: { role: 'eff' } });
    }
    else if (fabs.length < 1) {
        // PRIORITY 5: Fabs
        Game.spawns['S1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Fab' + Game.time,
            { memory: { role: 'fab' } });
    }
    else if (fab2s.length < 1) {
        // PRIORITY 6: Fab2s
        Game.spawns['S1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Fa2' + Game.time,
            { memory: { role: 'fab2' } });
    }
    else if (scavs.length < 1) {
        // PRIORITY 7: Scavs
        Game.spawns['S1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Scav' + Game.time,
            { memory: { role: 'scav' } });
    }
    else if (h2s.length < 3) {
        // PRIORITY 8: h2 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h2' } });
    }
    else if (h3s.length < 5) {
        // PRIORITY 9: h3 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h3' } });
    }
    else if (h4s.length < 3) {
        // PRIORITY 10: h4 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h4' } });
    }
    else if (h5s.length < 0) {
        // PRIORITY 11: h5 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h5' } });
    }
    else if (h6s.length < 5) { // <-- ADDED
        // PRIORITY 12: h5 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h6' } });
    }
    else if (h7s.length < 5) { // <-- ADDED
        // PRIORITY 13: h7 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h7' } });
    }
    else if (upts.length < 4) {
        // PRIORITY 14: Upts
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upt' + Game.time,
            { memory: { role: 'upt' } });
    }
    else if (builders.length < 1) {
        // PRIORITY 15: Builders
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY , CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'Builder' + Game.time,
            { memory: { role: 'builder' } });
    }
    

    // --- Visual Spawning Text ---
    if (Game.spawns['S1'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['S1'].spawning.name];
        Game.spawns['S1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['S1'].pos.x + 1,
            Game.spawns['S1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    // --- Creep Logic Execution Loop ---
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'haul') {
            roleHaul.run(creep);
        }
        else if (creep.memory.role == 'h2') {
            roleh2.run(creep);
        }
        else if (creep.memory.role == 'h3') {
            roleh3.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'fab') {
            rolefab.run(creep);
        }
        else if (creep.memory.role == 'fab2') {
            rolefab2.run(creep);
        }
        else if (creep.memory.role == 'upt') {
            roleupt.run(creep);
        }
        else if (creep.memory.role == 'scav') {
            rolescav.run(creep);
        }
        else if (creep.memory.role == 'h4') {
            roleh4.run(creep);
        }
        else if (creep.memory.role == 'eff') {
            roleeff.run(creep);
        }
        else if (creep.memory.role == 'h5') {
            roleh5.run(creep);
        }
        else if (creep.memory.role == 'h6') { // <-- ADDED
            roleh6.run(creep);
        }
        else if (creep.memory.role == 'h7') { // <-- ADDED
            roleh7.run(creep);
        }
    } // <-- End creep logic loop

    // --- Link Transfer Logic ---
    const sourceLink = Game.getObjectById('688a4f1d533a4abbdec23b97');
    const destLink = Game.getObjectById('688a609d889231db34f9795f');
    if (sourceLink && destLink && sourceLink.cooldown === 0 && sourceLink.store[RESOURCE_ENERGY] > 0) {
        sourceLink.transferEnergy(destLink);
    }

} // <-- End module.exports.loop