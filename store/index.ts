import create from 'zustand'

const usePath = create((set) => ({
    currentPathName: '',
    // updatePath: (path: string) => set((state) => state.currentPathName = path)
}))
export default usePath