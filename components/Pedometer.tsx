import { Pedometer } from 'expo-sensors';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';

const PedometerExample = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false); // Changement du type initial
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    // Vérifie si le pédomètre est disponible
    const checkPedometer = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(available);
      } catch (error) {
        Alert.alert("Erreur", "Impossible de vérifier la disponibilité du pédomètre.");
      }
    };

    checkPedometer();

    // Abonnement au capteur de pas
    const subscription = Pedometer.watchStepCount(result => {
      setStepCount(result.steps);
    });

    return () => {
      if (subscription) {
        subscription.remove(); // Nettoyage lors de la désactivation du composant
      }
    };
  }, []);

  const simulateSteps = () => {
    setStepCount(prevStepCount => prevStepCount + 100); // Simule 100 pas
  };

  return (
    <View style={{ padding: 20 }}>
      {isPedometerAvailable === null ? (
        <Text>Vérification de la disponibilité du pédomètre...</Text>
      ) : isPedometerAvailable ? (
        <>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Pedometer is available
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Steps taken: {stepCount}</Text>
          <Button title="Simulate 100 Steps" onPress={simulateSteps} />
        </>
      ) : (
        <Text style={{ fontSize: 18, color: 'red' }}>
          Pedometer is not available on this device.
        </Text>
      )}
    </View>
  );
};

export default PedometerExample;
