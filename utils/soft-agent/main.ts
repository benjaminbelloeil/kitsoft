/* eslint-disable @typescript-eslint/no-unused-vars */
// Main entry point for SOFT agent simulation
// This matches exactly the Python implementation in main.py

import { CertPathModel } from './model';
import { getAvailablePaths } from '../database/soft-agent-db';

/**
 * Print simulation results in a formatted way
 * Matches Python function: print_resultados(model)
 */
export function printResultados(model: CertPathModel) {
  const mejorSolucion = model.getMejorSolucion();
  
  if (!mejorSolucion) {
    console.log('\n❌ No se encontró una solución válida.');
    return;
  }

  console.log(`\n🎯 Path: ${model.getMeta()}`);
  console.log(`📊 Score total: ${model.getMejorScore().toFixed(2)}`);
  console.log('\n📚 Distribución de Certificados por Nivel:');
  console.log('='.repeat(50));

  for (const nivel of mejorSolucion) {
    console.log(`\n📍 Nivel ${nivel.nivel}:`);
    console.log('-'.repeat(40));

    for (const cert of nivel.certificados) {
      const certificado = cert.certificado;
      console.log(`\n📜 Certificado: ${certificado.curso}`);
      console.log(`🎯 Relevancia: ${cert.relevancia}`);
      console.log(`📈 Cobertura: ${cert.cobertura.toFixed(2)}`);
      console.log(`⚡ Dificultad: ${cert.dificultad}`);
      if (certificado.url_pagina_certificado) {
        console.log(`🔗 URL: ${certificado.url_pagina_certificado}`);
      }
    }
  }
}

/**
 * Show available paths if no ID is provided
 * Matches Python behavior in main.py
 */
export async function showAvailablePaths() {
  console.log('Paths disponibles:');
  const paths = await getAvailablePaths();
  
  for (const path of paths) {
    console.log(`ID: ${path.id_path}`);
    const details = Object.entries(path)
      .filter(([k, v]) => k !== 'id_path')
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    console.log('Detalles:', details);
    console.log('-'.repeat(40));
  }
  
  console.log('\nUso: Proporcione un id_path válido como parámetro');
}

/**
 * Validate UUID format
 * Matches Python UUID validation
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Main simulation runner
 * Matches Python main execution logic
 */
export async function runSimulation(idPath: string) {
  try {
    // Validate UUID
    if (!isValidUUID(idPath)) {
      console.error('Error: id_path debe ser un UUID válido');
      console.log('Ejemplo: 123e4567-e89b-12d3-a456-426614174000');
      return;
    }

    // Create and run the model
    const parameters = { steps: 10, id_path: idPath };
    const model = new CertPathModel(parameters);
    
    await model.run();
    
    printResultados(model);
    console.log('\nSimulación completa.');
    
    return model;
  } catch (error) {
    console.error('Error en la simulación:', error);
    throw error;
  }
}
