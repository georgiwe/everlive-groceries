import { EverliveWrapper } from './everlive';

function getFuncName (func: Function) {
    let funcStr = func.toString();
    let bracket = funcStr.indexOf('(');
    let name = funcStr.substring('function'.length, bracket);
    return name.trim();
}

let ctorsMap: any = {};

export function EverliveModel (modelFor?: string) {
	return function EverliveModel(ctor: any) {
		var className = modelFor || ctor.name || getFuncName(ctor);
        console.log('registered ctor for: ' + className);
		ctorsMap[className.toLowerCase()] = ctor;
	}
}

function camelToPascalCase (str: string) {
    return str[0].toUpperCase() + str.substring(1);
}

function createInstance (className: string) {
    className = className.toLowerCase();
    var ctor = ctorsMap[className];
	return new ctor();
}

function mapSingle (data: any, collName: string) {
    let instance = createInstance(collName);
    for (let prop in instance) {
        instance[prop] = data[camelToPascalCase(prop)]; // TODO: mapping for property names in decorators
    }
    return instance;
}

function mapMultiple(data: any, collName: string) {
    return data.map(el => mapSingle(el, collName));
}

export function map (data: any, collName: string) {
    let result: any;

    if (Array.isArray(data)) {
        console.log('mapping array...');
        result = mapMultiple(data, collName);
    } else {
        console.log('mapping single...');
        result = mapSingle(data, collName);
    }

    console.log('map result: ' + JSON.stringify(result));
    return result;
}
