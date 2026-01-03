import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { getFirebaseSdks } from '@/firebase/firebase-app';
import type { Device } from '@/lib/types';

function getDb() {
  return getFirebaseSdks().firestore;
}

/* =========================
   GET ALL DEVICES
========================= */
export async function getDevices(userId: string): Promise<Device[]> {
  if (typeof userId !== 'string') {
    throw new Error('getDevices: userId must be a string');
  }

  const firestore = getDb();
  const devicesRef = collection(firestore, 'users', userId, 'devices');
  const snapshot = await getDocs(devicesRef);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Device, 'id'>),
  }));
}

/* =========================
   GET DEVICE BY ID
========================= */
export async function getDeviceById(
  userId: string,
  deviceId: string
): Promise<Device | null> {
  if (typeof userId !== 'string' || typeof deviceId !== 'string') {
    throw new Error('getDeviceById: userId and deviceId must be strings');
  }

  const firestore = getDb();
  const ref = doc(firestore, 'users', userId, 'devices', deviceId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Device, 'id'>),
  };
}

/* =========================
   ADD DEVICE
========================= */
export async function addDevice(
  deviceData: Pick<Device, 'name' | 'type' | 'userId'>
): Promise<Device> {
  if (typeof deviceData.userId !== 'string') {
    throw new Error('addDevice: userId must be a string');
  }

  const firestore = getDb();
  const devicesRef = collection(
    firestore,
    'users',
    deviceData.userId,
    'devices'
  );

  const newDeviceData = {
    ...deviceData,
    status: 'Offline' as const,
    lastUpdated: new Date().toISOString(),
    location: { latitude: 0, longitude: 0 },
    history: 'Device just added.',
    speed: 0,
    battery: 100,
  };

  const docRef = await addDoc(devicesRef, newDeviceData);
  return { id: docRef.id, ...newDeviceData };
}

/* =========================
   UPDATE DEVICE
========================= */
export async function updateDevice(
  userId: string,
  deviceId: string,
  updates: Partial<Omit<Device, 'id'>>
): Promise<Device | null> {
  if (typeof userId !== 'string' || typeof deviceId !== 'string') {
    throw new Error(
      `updateDevice: invalid args (userId=${typeof userId}, deviceId=${typeof deviceId})`
    );
  }

  const firestore = getDb();
  const ref = doc(firestore, 'users', userId, 'devices', deviceId);

  await updateDoc(ref, {
    ...updates,
    lastUpdated: new Date().toISOString(),
  });

  const updated = await getDoc(ref);
  if (!updated.exists()) return null;

  return {
    id: updated.id,
    ...(updated.data() as Omit<Device, 'id'>),
  };
}

/* =========================
   DELETE DEVICE
========================= */
export async function deleteDevice(
  userId: string,
  deviceId: string
): Promise<boolean> {
  if (typeof userId !== 'string' || typeof deviceId !== 'string') {
    throw new Error('deleteDevice: userId and deviceId must be strings');
  }

  const firestore = getDb();
  const ref = doc(firestore, 'users', userId, 'devices', deviceId);
  await deleteDoc(ref);
  return true;
}
