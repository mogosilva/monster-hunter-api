document.getElementById('updateButton').addEventListener('click', updateEntry)
document.getElementById('deleteButton').addEventListener('click', deleteEntry)

async function updateEntry() {
	try 
	{
		const getMultiselectValues = () => {
			let select = document.getElementById('monsterWeaknesses')
			return [...select.options].filter(option => option.selected).map(option => option.value)
		}

		const response = await fetch('updateEntry', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: document.getElementById('monsterName').value.toLowerCase(),
				species: document.getElementById('monsterSpecies').value,
				weaknesses: getMultiselectValues()
			})
		})
		const data = await response.json()
		// console.log(data)
		location.reload()
	} 
	catch(error)
	{
		console.log( error )
	}
}

async function deleteEntry() {
	const input = document.getElementById('deleteInput')
	try{
		const response = await fetch('deleteEntry', {
			method: 'delete',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: input.value.toLowerCase()
			})
		})
		const data = await response.json()
		location.reload()
	}
	catch( error )
	{
		console.log( error )
	}
}