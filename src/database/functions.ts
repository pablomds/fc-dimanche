
import _ from "lodash"
import { collection, query, where } from "firebase/firestore"
import { doc, getDoc, getDocs, updateDoc , addDoc, deleteDoc } from "firebase/firestore"
import { db, storage } from "./firebase"
import { COLLECTION } from "./collection"
import { getStorage, ref, listAll, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage"
import { utils } from "../utils/utils"

export const getDataFromCollection = async (collectionName: COLLECTION, dataId: string) => {
    const docRef = doc(db, collectionName, dataId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { ...docSnap.data(), id: docRef.id };   
    return {}; 
    
};

export const getAllDataFromCollectionCreatedByUser = async (collectionName: COLLECTION, userId: string) => {
    let arrayData: any = [];
    const q = query(collection(db,collectionName), where('created_by', '==', userId));
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => arrayData.push({...doc.data(), id: doc.id}))

    if (arrayData.length === 1) {
        return arrayData[0];
    }
    
    return arrayData
};

export const getAllDataFromCollectionWithIds = async (collectionName: COLLECTION, listOfIds: string[]) => {

    let listOfData: any = []

    await Promise.all([
        listOfIds.forEach(async (id) => {
            const data = await getDataFromCollection(collectionName, id)
            listOfData.push(data)
        })]
    )

    return listOfData
};

export const getAllDataFromCollectionWithWhereArray = async (collectionName: COLLECTION, whereArray: any) => {

    let arrayData: any = []
    const q = query(collection(db,collectionName), where(whereArray.property, '==', whereArray.propertyValue))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        arrayData.push({...doc.data(), id: doc.id})
    })
    
    if (arrayData.length === 1) {
        return arrayData[0];
    }

    return arrayData
};

export const getAllDataFromCollectionWithWhereArrayContains = async (collectionName: COLLECTION, whereArray: any) => {

    let arrayData: any = []

    const q = query(collection(db,collectionName), where(whereArray.property, 'array-contains', whereArray.propertyValue));
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        arrayData.push({...doc.data(), id: doc.id})
    })
    // if (arrayData.length === 1) {
    //     return arrayData[0];
    // }
    return arrayData
};

export const getAllDataFromCollection = async (collectionName: COLLECTION) => {
    let allDataFromCollection: any = []
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    querySnapshot.forEach((doc) => {
      allDataFromCollection.push({ ...doc.data(), id: doc.id })
    });

    return _.filter(allDataFromCollection, 'is_active')
};

export const getAllDataFromCollectionEvenDisable = async (collectionName: COLLECTION) => {
    let allDataFromCollection: any = []
    const querySnapshot = await getDocs(collection(db, collectionName))
    
    querySnapshot.forEach((doc) => {
      allDataFromCollection.push({ ...doc.data(), id: doc.id })
    });

    return allDataFromCollection
};

export const addDocumentToCollection = async (collectionName: COLLECTION, dataToCollection: any): Promise<string> => {
    dataToCollection.created_date = utils.getUnixTimeStamp(new Date());
    dataToCollection.updated_date = utils.getUnixTimeStamp(new Date());
    dataToCollection.is_active = true;
    const addedDocumentToCollection = collection(db, collectionName);    
    const newDocRef = await addDoc(addedDocumentToCollection, dataToCollection);
    return newDocRef.id
    
};

export const updateDocumentToCollection = async (collectionName: string, dataToUpdateId: string, dataToUpdate: any) => {
    dataToUpdate.updated_date = utils.getUnixTimeStamp(new Date());
    console.log('-->',dataToUpdate)
    const docRefToUpdate = doc(db, collectionName, dataToUpdateId);
    await updateDoc(docRefToUpdate, dataToUpdate);

};


export const deleteDocumentFromCollection = async (collectionName: COLLECTION, dataToDeleteId: string): Promise<void> => {
    const docRefToDelete = doc(db, collectionName, dataToDeleteId)
    await deleteDoc(docRefToDelete)

};

export const deleteElementFromArrayInDocument = async (collectionName: COLLECTION, documentId: string, field: string, elementId: string) => {
    try {
        // Récupérer le document
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            // Obtenir le tableau du champ spécifié
            const fieldArray = docSnap.data()[field];
            if (Array.isArray(fieldArray)) {
                // Supprimer l'élément avec l'ID spécifié
                const updatedArray = fieldArray.filter((element: any) => element.id !== elementId);
                
                // Mettre à jour le document avec le nouveau tableau
                await updateDoc(docRef, { [field]: updatedArray });
                
                return { success: true };
            } else {
                return { success: false, error: "Le champ spécifié n'est pas un tableau." };
            }
        } else {
            return { success: false, error: "Le document spécifié n'existe pas." };
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'élément du tableau :", error);
        return { success: false, error: "Une erreur s'est produite lors de la suppression de l'élément du tableau." };
    }
};

export const listFiles = async (foldername: string) => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storageRef = getStorage();
    // Create a storage reference from our storage service
    const listRef = ref(storageRef, foldername);

    let imagesUrl: any[] = []

    const listAllFilesFromFolder = await listAll(listRef)

    await Promise.all(listAllFilesFromFolder.items.map(async (itemRef) => {
        let imageUrl = await getDownloadURL(itemRef)
        imagesUrl.push(imageUrl)
    }))
    return imagesUrl;
};

export const uploadFileToStorage = async (file: any, folderName: string): Promise<string> => {
    const storageRef = ref(storage, `/${folderName}/${file.name}`)
    await uploadBytesResumable(storageRef, file)
    return await getDownloadURL(storageRef)
};

export const deleteFileFromStorage = async (folderName: string, fileName: string): Promise<void> => {
    const storageRef = ref(storage, `/${folderName}/${fileName}`)
    return await deleteObject(storageRef)
};