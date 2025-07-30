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
const roleHaul = require('role.haul');
const roleeff = require('role.eff'); // <-- Add this line

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
    const effs = _.filter(Game.creeps, (c) => c.memory.role == 'eff'); // <-- Add this line

    // --- ADDED: Console log for creep counts ---
    console.log(`Roles: H:${harvesters.length}, Haul:${hauls.length}, H2:${h2s.length}, H3:${h3s.length}, H4:${h4s.length}, U:${upgraders.length}, B:${builders.length}, F:${fabs.length}, S:${scavs.length}, UPT:${upts.length}`);
    console.log(`Total Creeps: ${Object.keys(Game.creeps).length}`);


    // --- Tiered Spawning Logic ---
    // The 'else if' structure creates a priority queue.
    // It will only try to spawn a creep if all the tiers above it are full.
    if (harvesters.length < 2) {
        // PRIORITY 1: Harvesters
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 'Harvester' + Game.time,
            { memory: { role: 'harvester' } });
    }
    else if (hauls.length < 2) {
        // PRIORITY 2: Haulers
        Game.spawns['S1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 'Haul' + Game.time,
            { memory: { role: 'haul' } });
    }
    else if (h2s.length < 3) {
        // PRIORITY 3: h2 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h2' } });
    }
    else if (h3s.length < 5) {
        // PRIORITY 4: h3 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h3' } });
    }
    else if (h4s.length < 3) {
        // PRIORITY 5: h4 (Remote Harvesters)
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Inv' + Game.time,
            { memory: { role: 'h4' } });
    }
    else if (upgraders.length < 2) {
        // PRIORITY 6: Upgraders
        Game.spawns['S1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'Upgrader' + Game.time,
            { memory: { role: 'upgrader' } });
    }
    else if (effs.length < 2) {
        // PRIORITY 7: Eff hauler
        Game.spawns['S1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Eff' + Game.time,
            { memory: { role: 'eff' } });
    }
    else if (fabs.length < 1) {
        // PRIORITY 8: Fabs
        Game.spawns['S1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Fab' + Game.time,
            { memory: { role: 'fab' } });
    }
    else if (fab2s.length < 1) {
        // PRIORITY 9: Fab2s
        Game.spawns['S1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Fa2' + Game.time,
            { memory: { role: 'fab2' } });
    }
    else if (scavs.length < 1) {
        // PRIORITY 10: Scavs
        Game.spawns['S1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Scav' + Game.time,
            { memory: { role: 'scav' } });
    }
    else if (upts.length < 0) {
        // PRIORITY 11: Upts
        Game.spawns['S1'].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'Upt' + Game.time,
            { memory: { role: 'upt' } });
    }
    else if (builders.length < 3) {
        // PRIORITY 12: Builders
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
    } // <-- This brace closes the 'for' loop for creep logic.

} // <-- This brace closes the 'module.exports.loop' function. The error often happens if one of these is missing.
